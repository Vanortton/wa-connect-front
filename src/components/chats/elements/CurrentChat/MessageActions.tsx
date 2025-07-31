import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChatsContext } from '@/contexts/ChatsContext'
import { getBasicMessageContent } from '@/helpers/format'
import type { IWebMessageInfo } from '@/types/BaileysTypes'
import {
    ChevronDown,
    Copy,
    ReplyAll as Forward,
    Reply,
    Smile,
} from 'lucide-react'
import { useContext } from 'react'
import { toast } from 'sonner'
import ForwardMessage from './ForwardMessage'

export default function MessageActions({
    message,
}: {
    message: IWebMessageInfo
}) {
    const { setReplyMessage } = useContext(ChatsContext)
    const { id } = message.key

    const replyMessage = () => setReplyMessage(message)
    const copyMessage = async () => {
        try {
            const content = getBasicMessageContent(message)
            if (!content) return
            const messageTime = new Date(
                message.messageTimestamp * 1000
            ).toLocaleString()
            await navigator.clipboard.writeText(
                `[${messageTime}] ${message.pushName}: ${content}`
            )
            toast.success('Mensagem copiada')
        } catch (error) {
            console.log(error)
            toast.error('Não foi possível copiar mensagem')
        }
    }

    return (
        <div>
            <ForwardMessage msgId={id}>
                <button
                    id={`forward-${id}`}
                    className='hidden'
                />
            </ForwardMessage>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='outline'
                        size='sm'
                        className='rounded-full h-auto p-1 has-[>svg]:px-1 invisible group-hover:visible z-40'
                    >
                        <Smile />
                        <ChevronDown />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side='top'
                    sideOffset={10}
                    className='border-0 rounded-lg shadow-md'
                >
                    <DropdownMenuItem onClick={replyMessage}>
                        <Reply /> Responder
                    </DropdownMenuItem>
                    <label htmlFor={`forward-${id}`}>
                        <DropdownMenuItem>
                            <Forward className='icon-h-flip' />
                            Encaminhar mensagem
                        </DropdownMenuItem>
                    </label>
                    <DropdownMenuItem onClick={copyMessage}>
                        <Copy /> Copiar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
