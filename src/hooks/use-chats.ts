import { ChatsContext } from '@/contexts/ChatsContext'
import { db } from '@/firebase'
import type { Connection, Status } from '@/types/ChatsContextTypes'
import type { Chat } from '@/types/ChatsTypes'
import type { Attendant } from '@/types/StoreTypes'
import { useChatsStore } from '@/zustand/ChatsStore'
import { formatToPhone } from 'brazilian-values'
import {
    collection,
    doc,
    type DocumentData,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    startAfter,
    updateDoc,
} from 'firebase/firestore'
import { useContext } from 'react'
import type { Socket } from 'socket.io-client'
import { toast } from 'sonner'

type ChatInfo = {
    jid: string
    name: string
    photo: string | null
    isGroup: boolean
}
type Error = { code: number; message: string }

type ListenersParams = {
    socket: Socket
}

type LoadChatsParams = {
    connection: Connection
    socket: Socket
}

type FetchMessagesParams = {
    page: number
    chatId: string
    connection: Connection
    lastDoc?: DocumentData
}

type UpdateLastViewParams = {
    chatId: string
    attendant: Attendant
    socket?: Socket | null
}

type MarkAsAttendingParams = UpdateLastViewParams & {
    isAttending?: boolean
}

export const useChats = () => {
    const { setConnectionStatus, onNewMsg } = useContext(ChatsContext)
    const { setChat } = useChatsStore.getState()

    const onConnectionStatusChange = ({ status }: { status: Status }) =>
        setConnectionStatus(status)

    const updateChatInfo = ({ jid, name, photo, isGroup }: ChatInfo) =>
        setChat(jid, { name, photo, isGroup })

    const clearSocketListeners = (socket: Socket) => {
        socket.off('disconnect')
        socket.off('reconnect_failed')
        socket.off('new-message')
        socket.off('attendant-status')
        socket.off('connection-info')
        socket.off('update-chat-info')
        socket.off('error')
    }

    const addListeners = ({ socket }: ListenersParams) => {
        clearSocketListeners(socket)

        socket.on(
            'new-message',
            async ({ message }) => await onNewMsg({ message })
        )
        socket.on('attendant-status', onConnectionStatusChange)
        socket.on('update-chat-info', updateChatInfo)
        socket.on('error', (error: Error) => toast.error(error.message))
    }

    const getFallbackName = (jid: string) => {
        const jidTypes = {
            personal: '@s.whatsapp.net',
            group: '@g.us',
            broadcast: '@broadcast',
            status: 'status@broadcast',
            service: '0@s.whatsapp.net',
        }

        if (!jid || typeof jid !== 'string') return 'Desconhecido'

        if (jid.endsWith(jidTypes.personal))
            return formatToPhone(jid.split(jidTypes.personal)[0].slice(2))

        if (jid.endsWith(jidTypes.group))
            return `Grupo ${jid.split(jidTypes.group)[0]}`

        if (jid.endsWith(jidTypes.broadcast))
            return `Transmissão ${jid.split(jidTypes.broadcast)[0]}`

        if (jid.endsWith(jidTypes.status))
            return `Status ${formatToPhone(
                jid.split(jidTypes.status)[0].slice(2)
            )}`

        if (jid.endsWith(jidTypes.service)) return 'Serviço do WhatsApp'

        return 'Desconhecido'
    }

    const formatTime = (time: number): string => {
        const date = new Date(time * 1000)
        const now = new Date()

        const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()

        const yesterday = new Date()
        yesterday.setDate(now.getDate() - 1)
        const isYesterday =
            date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear()

        const daysOfWeek = [
            'domingo',
            'segunda',
            'terça',
            'quarta',
            'quinta',
            'sexta',
            'sábado',
        ]

        const monday = new Date(now)
        monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
        monday.setHours(0, 0, 0, 0)

        const sunday = new Date(monday)
        sunday.setDate(sunday.getDate() + 6)
        sunday.setHours(23, 59, 59, 999)

        const isCurrentWeek = date >= monday && date <= sunday

        if (isToday)
            return date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
            })
        if (isYesterday) return 'ontem'
        if (isCurrentWeek) return daysOfWeek[date.getDay()]

        return date.toLocaleDateString('pt-BR')
    }

    const loadChats = async ({ connection, socket }: LoadChatsParams) => {
        console.log('Função chamada')
        const { attendant, store } = connection
        const path = `users/${attendant.user}/stores/${store.id}/sync`

        const q = query(
            collection(db, path),
            limit(100),
            orderBy('lastMessage.messageTimestamp', 'desc')
        )

        onSnapshot(q, (snapshot) => {
            if (snapshot.empty) return

            snapshot.docChanges().forEach((change) => {
                const doc = change.doc
                const chatId = doc.id
                const chat = doc.data() as Chat

                console.log(chat)

                const updatedChat = setChat(chatId, {
                    ...chat,
                    id: chatId,
                })

                const hasInfos = updatedChat.photo || updatedChat.name
                if (socket && !hasInfos)
                    socket.emit('get-chat-info', {
                        jid: chatId,
                    })
            })
        })
    }

    const fetchMessages = async ({
        page,
        connection,
        chatId,
        lastDoc,
    }: FetchMessagesParams) => {
        const { attendant, store } = connection
        const path = `users/${attendant.user}/stores/${store.id}/sync/${chatId}/proto`
        let dbQuery
        if (page === 1) {
            dbQuery = query(
                collection(db, path),
                orderBy('messageTimestamp', 'desc'),
                limit(20)
            )
        } else if (lastDoc) {
            dbQuery = query(
                collection(db, path),
                orderBy('messageTimestamp', 'desc'),
                startAfter(lastDoc),
                limit(20)
            )
        } else return []

        const snapShot = await getDocs(dbQuery)

        if (snapShot.empty) return null

        console.log(
            snapShot.docs.map((d) => ({
                messageTimestamp: d.data().messageTimestamp,
            }))
        )
        return snapShot.docs
    }

    const markAsAttending = async ({
        chatId,
        attendant,
        isAttending,
    }: MarkAsAttendingParams) => {
        const docRef = doc(
            db,
            `users/${attendant.user}/stores/${attendant.store}/sync/${chatId}`
        )
        if (isAttending)
            await updateDoc(docRef, {
                attendingBy: { name: attendant.name, token: attendant.token },
            })
        else await updateDoc(docRef, { attendingBy: null })
    }

    const updateLastView = async ({
        chatId,
        attendant,
        socket,
    }: UpdateLastViewParams) => {
        console.log('Atualizando ultima visualização')
        const docRef = doc(
            db,
            `users/${attendant.user}/stores/${attendant.store}/sync/${chatId}`
        )
        await updateDoc(docRef, { lastView: Date.now(), unreadMessages: 0 })
        if (socket) {
            // socket.emit('mark-as-read', { jid: chatId })
        }
    }

    const markAsUnread = async ({
        chatId,
        attendant,
    }: UpdateLastViewParams) => {
        const docRef = doc(
            db,
            `users/${attendant.user}/stores/${attendant.store}/sync/${chatId}`
        )
        await updateDoc(docRef, { lastView: Date.now(), unreadMessages: true })
    }

    return {
        addListeners,
        getFallbackName,
        formatTime,
        loadChats,
        fetchMessages,
        markAsAttending,
        updateLastView,
        markAsUnread,
    }
}
