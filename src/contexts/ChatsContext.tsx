import { db } from '@/firebase'
import { useChats } from '@/hooks/use-chats'
import type {
    ChatDataFields,
    Connection,
    FieldValueMap,
    Status,
} from '@/types/ChatsContextTypes'
import type { Chat, Message, QuickMessage } from '@/types/ChatsTypes'
import type { Attendant } from '@/types/StoreTypes'
import { collection, onSnapshot, type DocumentData } from 'firebase/firestore'
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
    currentChatMsgs: DocumentData[]
    setCurrentChatMsgs: Dispatch<SetStateAction<DocumentData[]>>
    onNewMsg: (d: { message: Message }) => Promise<void>
    replyMessage: Message | null
    setReplyMessage: Dispatch<SetStateAction<Message | null>>
    quickMessages: QuickMessage[]
}

const ChatsContext = createContext<Context>({} as Context)

function ChatsProvider({ children }: { children: ReactNode }) {
    const [connectionStatus, setConnectionStatus] =
        useState<Status>('disconnected')
    const [connection, setConnection] = useState<Connection>({} as Connection)
    const [chats, setChats] = useState<Record<string, Chat>>({})
    const [currentChat, setCurrentChat] = useState<string | null>(null)
    const [currentChatMsgs, setCurrentChatMsgs] = useState<DocumentData[]>([])
    const [replyMessage, setReplyMessage] = useState<Message | null>(null)
    const [quickMessages, setQuickMessages] = useState<QuickMessage[]>([])
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
            const fakeDoc = {
                id: message.id,
                data: () => message,
            }
            setCurrentChatMsgs((prev) => [fakeDoc, ...prev])
            if (attendantRef.current) {
                await updateLastView({
                    chatId: message.chatId,
                    attendant: attendantRef.current,
                    socket: socketRef.current,
                })
            }
        }
    }

    useEffect(() => {
        if (connectionStatus === 'disconnected') socketRef.current = null
        if (connectionStatus !== 'connected' || !socketRef.current) return

        const { attendant, store } = connection
        const path = `users/${attendant.user}/stores/${store.id}/sync`

        const unsubscribeChats = onSnapshot(
            collection(db, path),
            (snapshot) => {
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

                        const alreadyHasInfo = prevChats[chatId]?.infosLoaded
                        if (!alreadyHasInfo && socketRef.current)
                            socketRef.current.emit('get-chat-info', {
                                jid: chatId,
                            })
                    })

                    return updatedChats
                })
            }
        )

        const messagesPath = `users/${attendant.user}/stores/${store.id}/quick-messages`

        const unsubscribeMessages = onSnapshot(
            collection(db, messagesPath),
            (snapshot) => {
                if (snapshot.empty) return
                const messages = snapshot.docs.map((doc) =>
                    doc.data()
                ) as QuickMessage[]

                setQuickMessages(messages)
            }
        )

        return () => {
            unsubscribeChats()
            unsubscribeMessages()
        }
    }, [connection, connectionStatus])

    useEffect(() => {
        setReplyMessage(null)
        if (currentChat) {
            fetchMessages({ page: 1, chatId: currentChat, connection }).then(
                (docs) => {
                    if (!docs) return
                    setCurrentChatMsgs(docs)
                }
            )
            updateLastView({
                chatId: currentChat,
                attendant: connection.attendant,
                socket: socketRef.current,
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
                setCurrentChatMsgs,
                onNewMsg,
                replyMessage,
                setReplyMessage,
                quickMessages,
            }}
        >
            {children}
        </ChatsContext.Provider>
    )
}

export { ChatsContext, ChatsProvider }
