import { Button } from '@/components/ui/button'
import { ChatsContext } from '@/contexts/ChatsContext'
import { useChats } from '@/hooks/use-chats'
import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp, Loader2, Loader2Icon } from 'lucide-react'
import { useContext, useEffect, useRef, useState } from 'react'
import MessageItem from './MessageItem'

export default function ChatMessages() {
    const {
        currentChatMsgs,
        setCurrentChatMsgs,
        chats,
        currentChat,
        replyMessage,
        connection,
        loadingMsgs,
    } = useContext(ChatsContext)
    const { fetchMessages } = useChats()
    const chat = currentChat ? chats[currentChat] : null
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [inBottom, setInBottom] = useState<boolean>(true)
    const [loadingMore, setLoadingMore] = useState<boolean>(false)
    const [page, setPage] = useState<number>(2)
    const [finishedLoad, setFinishedLoad] = useState<boolean>(false)

    const scrollBottom = () => {
        const div = containerRef.current
        if (div) div.scrollTo(0, div.scrollHeight)
    }

    useEffect(() => {
        const div = containerRef.current
        if (!div) return

        const handleScroll = () => {
            const inBottom = div.scrollTop === 0
            setInBottom(inBottom)
        }

        div.addEventListener('scroll', handleScroll)
        return () => div.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const div = containerRef.current
        if (!div) return

        const scrollPosition = div.scrollTop + div.clientHeight
        const nearBottom = scrollPosition >= div.scrollHeight - 100
        if (nearBottom) scrollBottom()
    }, [currentChatMsgs])

    const loadMore = () => {
        if (!currentChat) return
        setLoadingMore(true)
        const lastDoc = currentChatMsgs[currentChatMsgs.length - 1]
        fetchMessages({ page, connection, chatId: currentChat, lastDoc }).then(
            (docs) => {
                setLoadingMore(false)
                if (!docs) return setFinishedLoad(true)
                setCurrentChatMsgs((prev) => [...prev, ...docs])
                setPage((prev) => prev + 1)
            }
        )
    }

    useEffect(() => {
        setPage(2)
        setFinishedLoad(false)
        setInBottom(true)
        setLoadingMore(false)
    }, [currentChat])

    if (loadingMsgs)
        return (
            <div className='flex-1 flex flex-col gap-2 items-center justify-center'>
                <Loader2Icon className='animate-spin' />
                Carregando mensagens
            </div>
        )
    return (
        <div
            className='flex-1 flex flex-col-reverse overflow-y-auto scroll-smooth scrollbar-transparent p-5 min-h-0 gap-3'
            id='msgs-container'
            ref={containerRef}
        >
            {currentChatMsgs.map((doc) => {
                const msg = doc.data()
                if (msg.content.type === 'unknown') return
                return (
                    <MessageItem
                        message={msg}
                        isGroup={chat?.isGroup || false}
                        key={msg.id}
                    />
                )
            })}
            {!loadingMore && (
                <div className='flex justify-center'>
                    <Button
                        variant='secondary'
                        onClick={loadMore}
                    >
                        <ArrowUp /> Carregar mais
                    </Button>
                </div>
            )}
            {loadingMore && (
                <div className='flex justify-center'>
                    <div className='bg-background dark:bg-muted text-primary p-1 rounded-full shadow-md'>
                        <Loader2 className='animate-spin' />
                    </div>
                </div>
            )}
            {finishedLoad && page > 2 && (
                <p className='text-center'>Você chegou ao fim</p>
            )}
            {!inBottom && (
                <Button
                    size='icon'
                    className={cn(
                        'fixed right-6 rounded-full border-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-black dark:text-white',
                        replyMessage ? 'bottom-32' : 'bottom-24'
                    )}
                    onClick={scrollBottom}
                >
                    <ArrowDown />
                </Button>
            )}
        </div>
    )
}
