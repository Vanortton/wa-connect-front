import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import EaseDropdown from '@/components/ui/ease-dropdown'
import { ChatsContext } from '@/contexts/ChatsContext'
import { useChats } from '@/hooks/use-chats'
import { cn } from '@/lib/utils'
import type { Chat } from '@/types/ChatsTypes'
import {
    ChevronDown,
    EllipsisVertical,
    SquareMousePointer,
    User,
    Users,
} from 'lucide-react'
import { useContext } from 'react'

type ChatOnlyParam = { chat: Chat }
type ActionBtnParamsType = {
    size: 'icon'
    variant: 'ghost'
    className: string
}

export default function Header({ chat }: ChatOnlyParam) {
    const { setCurrentChat } = useContext(ChatsContext)
    const { getFallbackName } = useChats()
    const displayName = chat.name || getFallbackName(chat.id)
    const actionBtn: ActionBtnParamsType = {
        size: 'icon',
        variant: 'ghost',
        className: 'rounded-full',
    }

    return (
        <div className='flex items-center justify-between bg-background dark:bg-zinc-900 py-3 px-4 shadow-sm z-20'>
            <div className='flex items-center gap-2'>
                <Avatar className='min-w-[40px] h-[40px]'>
                    <AvatarImage
                        src={chat.photo || ''}
                        alt={`Avatar de ${displayName}`}
                    />
                    <AvatarFallback className='bg-gray-400 dark:bg-gray-600 text-white'>
                        {chat.isGroup ? <Users /> : <User />}
                    </AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                    <div className='flex items-center gap-2'>
                        <p>{displayName}</p>
                        <AttendingControls chat={chat} />
                    </div>
                    <span className='text-xs text-muted-foreground'>
                        Descrição/Status do chat (Em breve)
                    </span>
                </div>
            </div>

            <div className='flex gap-2'>
                {/* <Button {...actionBtn}>
                    <Search />
                </Button> */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button {...actionBtn}>
                            <EllipsisVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setCurrentChat(null)}>
                            Fechar conversa
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

function AttendingControls({ chat }: ChatOnlyParam) {
    const { connection } = useContext(ChatsContext)
    const { markAsAttending } = useChats()
    const attendingByMe = chat.attendingBy?.token === connection.attendant.token

    return (
        <>
            {chat.attendingBy ? (
                <div className='flex items-center gap-1'>
                    <Badge
                        className={cn(
                            'bg-blue-600 rounded-full py-1 px-3 text-sm',
                            attendingByMe && 'pe-2'
                        )}
                    >
                        {chat.attendingBy.name}
                        {attendingByMe && (
                            <EaseDropdown
                                trigger={
                                    <Badge className='bg-white text-black rounded-full py-0 px-2 ms-1'>
                                        Você <ChevronDown />
                                    </Badge>
                                }
                                items={[
                                    {
                                        label: 'Encerrar atendimento',
                                        onClick: () =>
                                            markAsAttending({
                                                chatId: chat.id,
                                                attendant: connection.attendant,
                                                isAttending: false,
                                            }),
                                    },
                                ]}
                            />
                        )}
                    </Badge>
                </div>
            ) : (
                <div>
                    <Button
                        className='bg-blue-600 hover:bg-blue-700 rounded-full h-auto py-1 px-3'
                        onClick={() => {
                            markAsAttending({
                                chatId: chat.id,
                                attendant: connection.attendant,
                                isAttending: true,
                            })
                        }}
                    >
                        <SquareMousePointer />
                        Marcar como atendendo
                    </Button>
                </div>
            )}
        </>
    )
}
