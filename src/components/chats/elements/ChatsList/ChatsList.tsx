import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import EaseTooltip from '@/components/ui/ease-tooltip'
import { ChatsContext } from '@/contexts/ChatsContext'
import { removeWhatsAppFormatting } from '@/helpers/messages'
import { useChats } from '@/hooks/use-chats'
import { cn } from '@/lib/utils'
import type { Chat, MediaType, Message } from '@/types/ChatsTypes'
import {
    File,
    Headphones,
    Image,
    Mic,
    Sticker,
    User,
    Users,
    Video,
} from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import stc from 'string-to-color'
import Header from './Header'

type ChatItemParams = { chat: Chat }

export default function ChatsList() {
    const { chats, connection } = useContext(ChatsContext)
    const { attendant } = connection
    const [filter, setFilter] = useState<string>('all')
    const [filteredChats, setFilteredChats] = useState<Chat[]>([])
    const [search, setSearch] = useState<string>('')

    const chatsArray = Object.values(chats).sort((a, b) => {
        const aTime = a.lastMessage?.timestamp || 0
        const bTime = b.lastMessage?.timestamp || 0
        return bTime - aTime
    })
    const unreadChats = chatsArray.reduce((acc, value) => {
        if (value.unreadMessages > 0) return acc + 1
        return acc
    }, 0)
    document.title = unreadChats > 0 ? `(${unreadChats}) VAZAP` : 'VAZAP'
    const filters = [
        { key: 'all', label: 'Todos' },
        { key: 'attending', label: 'Atendendo' },
        { key: 'unread', label: `Não lidas (${unreadChats})` },
    ]

    useEffect(() => {
        setFilteredChats(
            chatsArray.filter((chat) => {
                const chatKey = chat.name || chat.id
                const includesSearch = chatKey.includes(search)
                if (filter === 'attending') {
                    const attendingByMe =
                        chat.attendingBy?.token === attendant.token
                    return attendingByMe && includesSearch
                } else if (filter === 'unread') {
                    const hasUnreadMessages = chat.unreadMessages > 0
                    return hasUnreadMessages && includesSearch
                }
                return includesSearch
            })
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, filter, chats])

    // useEffect(() => {})

    return (
        <div className='w-[350px] bg-background dark:bg-zinc-900 h-full border-x-1 flex flex-col gap-3'>
            <Header
                filters={filters}
                onFilter={setFilter}
                onSearch={setSearch}
            />
            {filteredChats.length ? (
                <div className='flex-1 min-h-0 overflow-y-auto scrollbar-transparent px-3 flex flex-col gap-1'>
                    {filteredChats.map((chat) => (
                        <ChatItem
                            chat={chat}
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

function ChatItem({ chat }: ChatItemParams) {
    const { currentChat, setCurrentChat } = useContext(ChatsContext)
    const { getFallbackName, formatTime } = useChats()
    const buttonClass =
        'flex items-center gap-3 py-[10px] px-[14px] rounded-xl transition-colors'
    const displayName = chat.name || getFallbackName(chat.id)
    const hasUnreadMessages = chat.unreadMessages > 0

    return (
        <div
            tabIndex={0}
            role='button'
            aria-pressed={currentChat === chat.id}
            className={cn(
                buttonClass,
                currentChat === chat.id ? 'bg-muted' : 'hover:bg-accent'
            )}
            onClick={() => setCurrentChat(chat.id)}
        >
            <Avatar className='min-w-[40px] h-[40px]'>
                <AvatarImage
                    src={chat.photo || ''}
                    alt={`Avatar de ${displayName}`}
                />
                <AvatarFallback className='bg-gray-400 dark:bg-gray-600 text-white'>
                    {chat.isGroup ? <Users /> : <User />}
                </AvatarFallback>
            </Avatar>

            <div className='flex flex-col flex-1 min-w-0'>
                <div className='flex justify-between items-center w-full gap-2'>
                    <div className='flex items-center gap-2'>
                        <p className='line-clamp-1'>{displayName}</p>{' '}
                        {chat.attendingBy && (
                            <EaseTooltip
                                trigger={
                                    <span
                                        className='text-white p-[3px] rounded-full'
                                        style={{
                                            background: stc(
                                                chat.attendingBy.token
                                            ),
                                            color: getContrastColor(
                                                stc(chat.attendingBy.token)
                                            ),
                                        }}
                                    >
                                        <Headphones size={12} />
                                    </span>
                                }
                                title={chat.attendingBy.name}
                            />
                        )}
                    </div>
                    <p
                        className={cn(
                            'text-muted-foreground text-xs',
                            hasUnreadMessages && 'text-green-600'
                        )}
                    >
                        {formatTime(chat.lastMessage.timestamp)}
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='flex-1 min-w-0'>
                        <p className='text-muted-foreground text-sm truncate'>
                            {getLastMessageContent(chat.lastMessage)}
                        </p>
                    </div>
                    {hasUnreadMessages && (
                        <span className='h-4 min-w-4 px-1 bg-green-600 text-white rounded-full text-xs flex items-center justify-center'>
                            {chat.unreadMessages}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

function getLastMessageContent(message: Message) {
    const { content: msg } = message
    const { type } = msg

    const fileType =
        type === 'image' ||
        type === 'video' ||
        type === 'audio' ||
        type === 'document' ||
        type === 'sticker'

    if (type === 'text') return removeWhatsAppFormatting(msg.content.text)
    else if (type === 'extendedText')
        return removeWhatsAppFormatting(msg.content.text)
    else if (fileType) return replaceType(type)
    else return 'Mensagem não disponível'
}

function replaceType(type: MediaType) {
    const description = { className: 'flex items-center gap-1' }
    const iconConfig = { size: 12, strokeWidth: 3 }

    switch (type) {
        case 'image':
            return (
                <span {...description}>
                    <Image {...iconConfig} />
                    Imagem
                </span>
            )
        case 'video':
            return (
                <span {...description}>
                    <Video {...iconConfig} />
                    Vídeo
                </span>
            )
        case 'audio':
            return (
                <span {...description}>
                    <Mic {...iconConfig} />
                    Audio
                </span>
            )
        case 'document':
            return (
                <span {...description}>
                    <File {...iconConfig} />
                    Arquivo
                </span>
            )
        case 'sticker':
            return (
                <span {...description}>
                    <Sticker {...iconConfig} />
                    Figurinha
                </span>
            )
        default:
            return 'Mensagem não disponível'
    }
}

function getContrastColor(hex: string): 'black' | 'white' {
    hex = hex.replace('#', '')

    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    return luminance > 0.5 ? 'black' : 'white'
}
