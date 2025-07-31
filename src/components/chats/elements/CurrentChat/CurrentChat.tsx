import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { ChatsContext } from '@/contexts/ChatsContext'
import { useChats } from '@/hooks/use-chats'
import { cn } from '@/lib/utils'
import { useChatsStore } from '@/zustand/ChatsStore'
import { useChatMessages } from '@/zustand/MessagesStore'
import { MessagesSquare, SquareCheck } from 'lucide-react'
import { useContext, useEffect, useRef, useState } from 'react'
import ChatMessages from './ChatMessages'
import Header from './Header'
import SelectionActions from './SelectionActions'
import SendMessageForm from './SendMessage'

type Modes = 'default' | 'selection'

export default function CurrentChat() {
    const [mode, setMode] = useState<Modes>('default')
    const [selectedMessages, setSelectedMessages] = useState<string[]>([])
    const currentChat = useChatsStore((s) => s.currentChat)
    const setCurrentChat = useChatsStore((s) => s.setCurrentChat)
    const setMessages = useChatMessages((s) => s.setMessages)
    const setLoadingMsgs = useChatMessages((s) => s.setLoadingMessages)
    const chat = useChatsStore((s) =>
        s.currentChat ? s.chats[s.currentChat] : null
    )
    const formRef = useRef<HTMLFormElement | null>(null)
    const { connection, socketRef } = useContext(ChatsContext)
    const { fetchMessages, updateLastView } = useChats()

    const handleChange = () => {
        if (!formRef.current) return
        const checkeds = formRef.current.querySelectorAll('input:checked')
        const ids = Array.from(checkeds).map(
            (input) => (input as HTMLInputElement).value
        )
        setSelectedMessages(ids)
    }

    useEffect(() => {
        console.log(selectedMessages)
    }, [selectedMessages])

    useEffect(() => {
        const onKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Escape') setCurrentChat(null)
        }
        document.addEventListener('keyup', onKeyUp, false)
        return () => document.removeEventListener('keyup', onKeyUp, false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!currentChat) return
        setLoadingMsgs(true)
        fetchMessages({ page: 1, chatId: currentChat, connection }).then(
            (docs) => {
                if (!docs) return
                setMessages(docs)
                setLoadingMsgs(false)
            }
        )
        updateLastView({
            chatId: currentChat,
            attendant: connection.attendant,
            socket: socketRef.current,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChat, connection, socketRef])

    useEffect(() => {
        if (!formRef.current) return
        const checkboxes = formRef.current.querySelectorAll<HTMLInputElement>(
            'input[type="checkbox"]'
        )
        checkboxes.forEach((cb) => {
            cb.checked = false
        })
        setSelectedMessages([])
    }, [mode])

    if (!currentChat || !chat)
        return (
            <div className='flex-1 flex flex-col gap-4 items-center justify-center'>
                <MessagesSquare
                    size={100}
                    className='text-primary'
                />
                <p>Nenhuma conversa selecionada</p>
            </div>
        )

    return (
        <>
            <div className='flex-1 flex flex-col min-h-0'>
                {mode === 'default' ? (
                    <Header chat={chat} />
                ) : (
                    <SelectionActions
                        checked={selectedMessages}
                        onCancel={() => setMode('default')}
                    />
                )}
                <div className='flex-1 flex flex-col bg-muted dark:bg-background min-h-0'>
                    <ContextMenu>
                        <ContextMenuTrigger className='flex-1 flex min-h-0'>
                            <form
                                ref={formRef}
                                onChange={handleChange}
                                className={cn(
                                    'flex-1 flex',
                                    mode === 'selection'
                                        ? '[&_.message-highlight]:group-hover:bg-black/10 [&_.message-highlight]:dark:group-hover:bg-white/10 [&_.message-highlight]:has-checked:bg-primary/30 [&_.message-highlight]:has-checked:hover:bg-primary/50 [&_.message-highlight]:dark:group-hover:has-checked:bg-primary/40'
                                        : '[&_.message-checkbox]:hidden'
                                )}
                                data-mode={mode}
                                onReset={() => setSelectedMessages([])}
                            >
                                <ChatMessages />
                            </form>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem
                                onClick={() => setMode('selection')}
                            >
                                <SquareCheck /> Selecionar mensagens
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                    <div className='p-4'>
                        <SendMessageForm />
                    </div>
                </div>
            </div>
        </>
    )
}
