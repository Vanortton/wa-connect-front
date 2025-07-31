'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChatsContext } from '@/contexts/ChatsContext'
import { db } from '@/firebase'
import { useChats } from '@/hooks/use-chats'
import type { Chat } from '@/types/ChatsTypes'
import { useLabelsStore } from '@/zustand/LabelsStore'
import { doc, updateDoc } from 'firebase/firestore'
import { ChevronDown, CircleX, MessageSquareDot, Tag } from 'lucide-react'
import { useContext } from 'react'

type ChatItemParams = { chat: Chat }

export default function ChatActions({ chat }: ChatItemParams) {
    const { connection } = useContext(ChatsContext)
    const { markAsUnread } = useChats()
    const { attendant, store } = connection
    const labels = useLabelsStore((s) => s.labels)

    const handleLabelChat = async (labelId: number | null) => {
        try {
            const chatPath = `users/${attendant.user}/stores/${store.id}/sync/${chat.id}`
            const docRef = doc(db, chatPath)
            await updateDoc(docRef, {
                labelId,
            })
        } catch (err) {
            console.error('Erro ao etiquetar chat:', err)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className='h-auto p-0 has-[>svg]:px-0 rounded-sm absolute top-0 right-1 invisible group-hover:visible'
                    variant='ghost'
                    onClick={(e) => e.stopPropagation()}
                >
                    <ChevronDown />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side='right'
                sideOffset={10}
                className='rounded-lg shadow-md'
            >
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation()
                        markAsUnread({ chatId: chat.id, attendant })
                    }}
                >
                    <MessageSquareDot className='mr-2 size-4' />
                    Marcar como não lido
                </DropdownMenuItem>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Tag className='mr-2 size-4' />
                        Etiquetar conversa
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className='max-h-60 overflow-y-auto'>
                        {Object.values(labels).map((label) => (
                            <DropdownMenuItem
                                key={label.id}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleLabelChat(label.id)
                                }}
                                className='gap-2'
                            >
                                <Tag
                                    className='size-4'
                                    style={{ color: label.color }}
                                />
                                {label.name}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation()
                                handleLabelChat(null)
                            }}
                            className='gap-2'
                        >
                            <CircleX />
                            Desassociar
                        </DropdownMenuItem>
                        {Object.values(labels).length === 0 && (
                            <DropdownMenuItem
                                disabled
                                className='text-muted-foreground'
                            >
                                Nenhuma etiqueta
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
