import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import EaseTooltip from '@/components/ui/ease-tooltip'
import { getContrastColor, getLastMessageContent } from '@/helpers/chatsList'
import { useChats } from '@/hooks/use-chats'
import { cn } from '@/lib/utils'
import { useChatsStore } from '@/zustand/ChatsStore'
import { useLabelsStore } from '@/zustand/LabelsStore'
import { Headphones, Tag, User, Users } from 'lucide-react'
import React from 'react'
import stc from 'string-to-color'
import ChatActions from './ChatActions'

type ChatItemParams = { chatId: string }

function ChatItem({ chatId }: ChatItemParams) {
    const { getFallbackName, formatTime } = useChats()
    const chat = useChatsStore((s) => s.chats[chatId])
    const setCurrentChat = useChatsStore((s) => s.setCurrentChat)
    const buttonClass =
        'relative group flex items-center gap-3 py-[10px] px-[14px] rounded-xl transition-colors outline-none'
    const displayName = chat?.name || getFallbackName(chatId)
    const hasUnreadMessages = chat?.unreadMessages > 0
    const lastMsgTimestamp = chat.lastMessage.messageTimestamp
    const labels = useLabelsStore((s) => s.labels)

    console.log('Chat atualizado')

    return (
        <div
            tabIndex={0}
            role='button'
            aria-pressed={chat.current}
            className={cn(
                buttonClass,
                chat.current ? 'bg-muted' : 'hover:bg-accent'
            )}
            onClick={() => setCurrentChat(chatId)}
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
                        {chat.labelId && labels[chat.labelId] && (
                            <EaseTooltip
                                trigger={
                                    <Tag
                                        size={14}
                                        style={{
                                            color: labels[chat.labelId].color,
                                        }}
                                    />
                                }
                                title={labels[chat.labelId].name}
                            />
                        )}
                    </div>
                    <p
                        className={cn(
                            'text-muted-foreground text-xs',
                            hasUnreadMessages && 'text-green-600'
                        )}
                    >
                        {formatTime(lastMsgTimestamp)}
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

            <ChatActions chat={chat} />
        </div>
    )
}

export default React.memo(ChatItem)
