import { db } from '@/firebase'
import { useChats } from '@/hooks/use-chats'
import type { IWebMessageInfo } from '@/types/BaileysTypes'
import type { Connection, Status } from '@/types/ChatsContextTypes'
import type { QuickMessage } from '@/types/ChatsTypes'
import type { Attendant } from '@/types/StoreTypes'
import { useChatsStore } from '@/zustand/ChatsStore'
import { useLabelsStore } from '@/zustand/LabelsStore'
import { useChatMessages } from '@/zustand/MessagesStore'
import { collection, doc, onSnapshot } from 'firebase/firestore'
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
    connectionStatus: Status
    setConnectionStatus: Dispatch<SetStateAction<Status>>
    connection: Connection
    setConnection: Dispatch<SetStateAction<Connection>>
    socketRef: React.RefObject<Socket | null>
    onNewMsg: (d: { message: IWebMessageInfo }) => Promise<void>
    replyMessage: IWebMessageInfo | null
    setReplyMessage: Dispatch<SetStateAction<IWebMessageInfo | null>>
    quickMessages: QuickMessage[]
}

const ChatsContext = createContext<Context>({} as Context)

function ChatsProvider({ children }: { children: ReactNode }) {
    const [connectionStatus, setConnectionStatus] =
        useState<Status>('disconnected')
    const [connection, setConnection] = useState<Connection>({} as Connection)
    const [replyMessage, setReplyMessage] = useState<IWebMessageInfo | null>(
        null
    )
    const { setLabels } = useLabelsStore.getState()
    const [quickMessages, setQuickMessages] = useState<QuickMessage[]>([])
    const socketRef = useRef<Socket | null>(null)
    const attendantRef = useRef<Attendant | null>(null)
    const currentChatRef = useRef<string | null>(null)
    const currentChat = useChatsStore((s) => s.currentChat)
    const addMessage = useChatMessages((s) => s.addMessage)
    const { loadChats, updateLastView } = useChats()

    const onNewMsg = async ({ message }: { message: IWebMessageInfo }) => {
        console.log(
            'Nova mensagem',
            message.key.remoteJid,
            currentChatRef.current
        )
        if (message.key.remoteJid === currentChatRef.current) {
            const fakeDoc = {
                id: message.key.id,
                data: () => message,
            }
            addMessage(fakeDoc, true)
            if (attendantRef.current) {
                await updateLastView({
                    chatId: message.key.remoteJid,
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
        loadChats({ connection, socket: socketRef.current })

        const storeDocPath = `users/${attendant.user}/stores/${store.id}`
        const messagesPath = `${storeDocPath}/quick-messages`

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

        const unsubscribeStoreDoc = onSnapshot(
            doc(db, storeDocPath),
            (docSnap) => {
                if (!docSnap.exists()) return
                const data = docSnap.data()
                if (data.labels) setLabels(data.labels)
            }
        )

        return () => {
            unsubscribeMessages()
            unsubscribeStoreDoc()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connection, connectionStatus])

    // useEffect(() => {
    //     setReplyMessage(null)
    //     setCurrentChatMsgs([])
    //     setLoadingMsgs(true)
    //     if (currentChat) {
    //         fetchMessages({ page: 1, chatId: currentChat, connection }).then(
    //             (docs) => {
    //                 if (!docs) return
    //                 setCurrentChatMsgs(docs)
    //                 setLoadingMsgs(false)
    //             }
    //         )
    //         updateLastView({
    //             chatId: currentChat,
    //             attendant: connection.attendant,
    //             socket: socketRef.current,
    //         })
    //     }
    //     currentChatRef.current = currentChat
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [currentChat])

    useEffect(() => {
        if (connection.attendant) attendantRef.current = connection.attendant
    }, [connection])

    useEffect(() => {
        currentChatRef.current = currentChat
    }, [currentChat])

    return (
        <ChatsContext.Provider
            value={{
                connectionStatus,
                setConnectionStatus,
                connection,
                setConnection,
                socketRef,
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
