import { ChatsContext } from '@/contexts/ChatsContext'
import { MessagesSquare } from 'lucide-react'
import { useContext, useEffect } from 'react'
import ChatMessages from './ChatMessages'
import Header from './Header'
import SendMessageForm from './SendMessage'

export default function CurrentChat() {
    const { chats, currentChat, setCurrentChat } = useContext(ChatsContext)

    console.log(currentChat)

    useEffect(() => {
        const onKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Escape') setCurrentChat(null)
        }
        document.addEventListener('keyup', onKeyUp, false)
        return () => document.removeEventListener('keyup', onKeyUp, false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!currentChat)
        return (
            <div className='flex-1 flex flex-col gap-4 items-center justify-center'>
                <MessagesSquare
                    size={100}
                    className='text-primary'
                />
                <p>Nenhuma conversa selecionada</p>
            </div>
        )

    const chat = chats[currentChat]
    return (
        <>
            <div className='flex-1 flex flex-col min-h-0'>
                <Header chat={chat} />
                <div className='flex-1 flex flex-col bg-muted dark:bg-background min-h-0'>
                    <ChatMessages />
                    <div className='p-4'>
                        <SendMessageForm />
                    </div>
                </div>
            </div>
        </>
    )
}
