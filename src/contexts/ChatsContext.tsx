import { db } from '@/firebase'
import { useChats } from '@/hooks/use-chats'
import type {
    ChatDataFields,
    Connection,
    FieldValueMap,
    Status,
} from '@/types/ChatsContextTypes'
import type { Chat, Message } from '@/types/ChatsTypes'
import type { Attendant } from '@/types/StoreTypes'
import { collection, onSnapshot } from 'firebase/firestore'
import {
    createContext,
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from 'react'
import type { Socket } from 'socket.io-client'

type Context = {
    chats: Record<string, Chat>
    setChatData: <K extends ChatDataFields>(
        chatId: string,
        field: K,
        value: FieldValueMap[K]
    ) => void
    connectionStatus: Status
    setConnectionStatus: Dispatch<SetStateAction<Status>>
    currentChat: string | null
    setCurrentChat: Dispatch<SetStateAction<string | null>>
    connection: Connection
    setConnection: Dispatch<SetStateAction<Connection>>
    socketRef: React.RefObject<Socket | null>
    currentChatMsgs: Message[]
    onNewMsg: (d: { message: Message }) => Promise<void>
}

const ChatsContext = createContext<Context>({} as Context)

function ChatsProvider({ children }: { children: ReactNode }) {
    const [connectionStatus, setConnectionStatus] =
        useState<Status>('disconnected')
    const [connection, setConnection] = useState<Connection>({} as Connection)
    const [chats, setChats] = useState<Record<string, Chat>>({})
    const [currentChat, setCurrentChat] = useState<string | null>(null)
    const [currentChatMsgs, setCurrentChatMsgs] = useState<Message[]>([])
    const currentChatRef = useRef<string | null>(null)
    const socketRef = useRef<Socket | null>(null)
    const attendantRef = useRef<Attendant | null>(null)
    const { fetchMessages, updateLastView } = useChats()

    const setChatData = <K extends ChatDataFields>(
        chatId: string,
        field: K,
        value: FieldValueMap[K]
    ) => {
        setChats((prev) => ({
            ...prev,
            [chatId]: {
                ...prev[chatId],
                [field]: value,
            },
        }))
    }

    const onNewMsg = async ({ message }: { message: Message }) => {
        setChatData(message.chatId, 'lastMessage', message)
        if (message.chatId === currentChatRef.current) {
            console.log('Mensagem no chat atual')
            setCurrentChatMsgs((prev) => [...prev, message])
            if (attendantRef.current)
                await updateLastView({
                    chatId: message.chatId,
                    attendant: attendantRef.current,
                })
        }
    }

    useEffect(() => {
        if (connectionStatus === 'disconnected') socketRef.current = null
        if (connectionStatus !== 'connected' || !socketRef.current) return

        const { attendant, store } = connection
        const path = `users/${attendant.user}/stores/${store.id}/sync`

        const unsubscribe = onSnapshot(collection(db, path), (snapshot) => {
            if (snapshot.empty) return

            setChats((prevChats) => {
                const updatedChats: Record<string, Chat> = { ...prevChats }

                snapshot.docs.forEach((doc) => {
                    const chatId = doc.id
                    const chat = doc.data() as Chat

                    updatedChats[chatId] = {
                        ...prevChats[chatId],
                        ...chat,
                        id: chatId,
                    }

                    const alreadyHasInfo =
                        prevChats[chatId]?.name || prevChats[chatId]?.photo
                    if (!alreadyHasInfo && socketRef.current) {
                        socketRef.current.emit('get-chat-info', { jid: chatId })
                    }
                })

                return updatedChats
            })
        })

        return () => unsubscribe()
    }, [connection, connectionStatus])

    useEffect(() => {
        if (currentChat) {
            fetchMessages({ page: 1, chatId: currentChat, connection }).then(
                (docs) => {
                    const docsData = docs
                        .map(
                            (doc) => ({ ...doc.data(), id: doc.id } as Message)
                        )
                        .sort((a, b) => a.timestamp - b.timestamp)
                    setCurrentChatMsgs(docsData)
                }
            )
            updateLastView({
                chatId: currentChat,
                attendant: connection.attendant,
            })
        }
        currentChatRef.current = currentChat
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChat])

    useEffect(() => {
        if (connection.attendant) attendantRef.current = connection.attendant
    }, [connection])

    return (
        <ChatsContext.Provider
            value={{
                chats,
                setChatData,
                connectionStatus,
                setConnectionStatus,
                currentChat,
                setCurrentChat,
                connection,
                setConnection,
                socketRef,
                currentChatMsgs,
                onNewMsg,
            }}
        >
            {children}
        </ChatsContext.Provider>
    )
}

export { ChatsContext, ChatsProvider }
