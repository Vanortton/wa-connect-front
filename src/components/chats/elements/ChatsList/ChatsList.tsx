import { ChatsContext } from '@/contexts/ChatsContext'
import { useChatsStore } from '@/zustand/ChatsStore'
import { useContext, useMemo, useState } from 'react'
import ChatItem from './ChatItem'
import Header from './Header'

export default function ChatsList() {
    const { connection } = useContext(ChatsContext)
    const { attendant } = connection
    const [filter, setFilter] = useState<string>('all')
    const [search, setSearch] = useState<string>('')
    const { chats } = useChatsStore()
    const chatsArray = useMemo(() => Object.values(chats), [chats])

    const unreadChats = chatsArray.reduce((acc, value) => {
        if (value.unreadMessages > 0) return acc + 1
        return acc
    }, 0)

    document.title = unreadChats > 0 ? `(${unreadChats}) VAZAP` : 'VAZAP'
    const filters = [
        { key: 'all', label: `Todos (${chatsArray.length})` },
        { key: 'attending', label: 'Atendendo' },
        { key: 'unread', label: `Não lidas (${unreadChats})` },
    ]

    const filteredChats = useMemo(() => {
        return chatsArray
            .sort((a, b) => {
                const aTime = (a.lastMessage?.messageTimestamp as number) || 0
                const bTime = (b.lastMessage?.messageTimestamp as number) || 0
                return bTime - aTime
            })
            .filter((chat) => {
                const chatKey = chat.name || chat.id
                if (!chatKey) return false
                const includesSearch = chatKey.includes(search)
                if (filter === 'attending') {
                    const attendingByMe =
                        chat.attendingBy?.token === attendant.token
                    return attendingByMe && includesSearch
                } else if (filter === 'unread') {
                    const hasUnreadMessages = chat.unreadMessages > 0
                    return hasUnreadMessages && includesSearch
                } else if (filter.startsWith('tag-')) {
                    const tagId = parseInt(filter.split('tag-')[1])
                    return chat.labelId === tagId && includesSearch
                }

                return includesSearch
            })
    }, [chatsArray, search, filter, attendant?.token])

    return (
        <div className='w-[380px] bg-background dark:bg-zinc-900 h-full border-x-1 flex flex-col gap-3'>
            <Header
                filters={filters}
                onFilter={setFilter}
                onSearch={setSearch}
            />
            {filteredChats.length ? (
                <div className='flex-1 min-h-0 overflow-y-auto scrollbar-transparent px-3 flex flex-col gap-1'>
                    {filteredChats.map((chat) => (
                        <ChatItem
                            chatId={chat.id}
                            key={chat.id}
                        />
                    ))}
                </div>
            ) : (
                <div className='flex-1 flex items-center justify-center'>
                    <p className='italic text-muted-foreground'>
                        Nenhuma conversa
                    </p>
                </div>
            )}
        </div>
    )
}
