import { Button } from '@/components/ui/button'
import { ChatsContext } from '@/contexts/ChatsContext'
import { useChats } from '@/hooks/use-chats'
import { useChatsStore } from '@/zustand/ChatsStore'
import { useChatMessages } from '@/zustand/MessagesStore'
import { ArrowUp, Loader2, Loader2Icon } from 'lucide-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import MessageItem from './MessageItem'
import ScrollBottom from './ScrollBottom'

export default function ChatMessages() {
    const { connection } = useContext(ChatsContext)
    const { fetchMessages } = useChats()

    const chatId = useChatsStore((s) => s.currentChat)
    const chat = useChatsStore((s) => s.chats[chatId || ''])
    const messages = useChatMessages((s) => s.messages)
    const loadingMessages = useChatMessages((s) => s.loadingMessages)
    const { clearMessages, addMessage } = useChatMessages.getState()

    const containerRef = useRef<HTMLDivElement | null>(null)
    const [loadingMore, setLoadingMore] = useState<boolean>(false)
    const [page, setPage] = useState<number>(2)
    const [finishedLoad, setFinishedLoad] = useState<boolean>(false)

    const loadMore = () => {
        if (!chatId) return
        setLoadingMore(true)
        const lastDoc = messages[messages.length - 1]
        fetchMessages({ page, connection, chatId: chatId || '', lastDoc }).then(
            (docs) => {
                setLoadingMore(false)
                if (!docs) return setFinishedLoad(true)
                docs.forEach((doc) => addMessage(doc))
                setPage((prev) => prev + 1)
            }
        )
    }

    useEffect(() => {
        setPage(2)
        clearMessages()
        setLoadingMore(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId])

    if (loadingMessages)
        return (
            <div className='flex-1 flex flex-col gap-2 items-center justify-center h-full'>
                <Loader2Icon className='animate-spin' />
                Carregando mensagens
            </div>
        )

    return (
        <div
            className='flex-1 flex flex-col-reverse overflow-y-auto scroll-smooth scrollbar-transparent min-h-0'
            id='msgs-container'
            ref={containerRef}
        >
            {[...messages].slice().map((doc, index) => {
                const currentDate = formatDate(doc.data().messageTimestamp)
                const nextDate = formatDate(
                    messages[index + 1]?.data().messageTimestamp
                )
                const showDate = currentDate !== nextDate

                return (
                    <React.Fragment key={doc.id}>
                        <MessageItem
                            message={doc}
                            isGroup={chat?.isGroup || false}
                        />
                        {showDate && <DaySeparator date={currentDate} />}
                    </React.Fragment>
                )
            })}
            {!loadingMore && (
                <div className='flex justify-center p-3'>
                    <Button
                        className='bg-background hover:bg-background dark:bg-muted text-foreground transition-discrete'
                        onClick={loadMore}
                    >
                        <ArrowUp /> Carregar mais
                    </Button>
                </div>
            )}
            {loadingMore && (
                <div className='flex justify-center p-3'>
                    <div className='bg-background dark:bg-muted text-primary p-1 rounded-full shadow-md'>
                        <Loader2 className='animate-spin' />
                    </div>
                </div>
            )}
            {finishedLoad && page > 2 && (
                <p className='text-center p-3'>Você chegou ao fim</p>
            )}
            <ScrollBottom containerRef={containerRef} />
        </div>
    )
}

function DaySeparator({ date }: { date: string }) {
    return (
        <div className='flex justify-center'>
            <span className='text-center text-sm text-muted-foreground my-4 px-2 py-1 rounded-sm bg-background dark:bg-muted shadow-sm'>
                {date}
            </span>
        </div>
    )
}

function formatDate(dateStr: number): string {
    const date = new Date(dateStr * 1000)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()

    const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()

    if (isToday) return 'Hoje'
    if (isYesterday) return 'Ontem'

    const day = String(date.getDate()).padStart(2, '0')
    const month = date.toLocaleString('pt-BR', { month: 'long' })
    const year = date.getFullYear()
    return `${day} de ${month} de ${year}`
}
