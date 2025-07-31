import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { ChatsContext } from '@/contexts/ChatsContext'
import { useChats } from '@/hooks/use-chats'
import { useChatsStore } from '@/zustand/ChatsStore'
import { User } from 'lucide-react'
import { useContext, useRef, useState, type ReactNode } from 'react'

type ForwardMessageParams = {
    children: ReactNode
    msgId: string
}

export default function ForwardMessage({
    children,
    msgId,
}: ForwardMessageParams) {
    const { socketRef } = useContext(ChatsContext)
    const currentChat = useChatsStore((s) => s.currentChat)
    const { getFallbackName } = useChats()
    const { chats } = useChatsStore.getState()
    const [selected, setSelected] = useState<Record<string, boolean>>({})
    const closeRef = useRef<HTMLButtonElement | null>(null)

    const toggleChat = (id: string) => {
        setSelected((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const selectedIds = Object.entries(selected)
            .filter(([, isChecked]) => isChecked)
            .map(([id]) => id)

        if (socketRef.current) {
            socketRef.current.emit('send-message', {
                jids: selectedIds,
                type: 'forward',
                content: {
                    originJid: currentChat,
                    msgId,
                },
            })
        }

        if (closeRef.current) closeRef.current.click()
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className='max-w-md'>
                <DialogTitle>Encaminhar mensagem</DialogTitle>
                <DialogDescription>
                    Enviar mensagem para outros contatos
                </DialogDescription>
                <form
                    onSubmit={handleSubmit}
                    className='space-y-4 mt-4'
                >
                    <div className='max-h-64 overflow-y-auto space-y-2'>
                        {Object.values(chats).map((chat) => (
                            <label
                                key={chat.id}
                                className='flex items-center gap-3 hover:bg-muted/50 p-2 rounded-md cursor-pointer'
                            >
                                <Checkbox
                                    checked={!!selected[chat.id]}
                                    onChange={() => toggleChat(chat.id)}
                                />
                                <div className='flex items-center gap-2'>
                                    <Avatar>
                                        <AvatarImage src={chat.photo || ''} />
                                        <AvatarFallback>
                                            <User />
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className='text-sm'>
                                        {chat.name || getFallbackName(chat.id)}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                    <div className='flex justify-end gap-2 pt-4'>
                        <DialogClose asChild>
                            <Button
                                type='button'
                                variant='ghost'
                                ref={closeRef}
                            >
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button
                            type='submit'
                            disabled={!Object.values(selected).some(Boolean)}
                        >
                            Enviar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
