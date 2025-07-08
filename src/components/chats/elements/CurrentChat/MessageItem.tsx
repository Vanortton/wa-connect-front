import AudioPlayer from '@/components/ui/audio-player'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChatsContext } from '@/contexts/ChatsContext'
import { getBasicMessageContent } from '@/helpers/messages'
import { cn } from '@/lib/utils'
import type { Message } from '@/types/ChatsTypes'
import { ChevronDown, Copy, ReplyAll as Forward, Reply } from 'lucide-react'
import { useContext, type ReactNode } from 'react'
import { toast } from 'sonner'
import ForwardMessage from './ForwardMessage'
import DocumentMessage from './MessageTypes/DocumentMessage'
import ExtendedMessage from './MessageTypes/ExtendedMessage'
import ImageMessage from './MessageTypes/ImageMessage'
import ReplyPreview from './MessageTypes/ReplyPreview'
import SimpleTextMessage from './MessageTypes/SimpleTextMessage'
import StickerMessage from './MessageTypes/StikerMessage'
import VideoMessage from './MessageTypes/VideoMessage'

type MessageItemParams = { message: Message; isGroup: boolean }
type MessageWrapperParams = { children: ReactNode; fromMe: boolean }

export default function MessageItem({ message, isGroup }: MessageItemParams) {
    const sendTime = new Date(message.timestamp * 1000).toLocaleTimeString()

    return (
        <div
            className={cn(
                'w-full flex group',
                message.sender.fromMe ? 'justify-end' : 'justify-start'
            )}
            id={message.id}
        >
            <MessageWrapper fromMe={message.sender.fromMe || false}>
                <MessageActions message={message} />
                {isGroup && (
                    <div className='text-xs text-muted-foreground'>
                        ~ {message.sender.pushName}
                    </div>
                )}
                {message.content.reply && (
                    <ReplyPreview message={message.content} />
                )}
                {getMessageContent(message.content)}
                <div className='flex justify-end text-xs text-muted-foreground'>
                    {sendTime}
                </div>
            </MessageWrapper>
        </div>
    )
}

function MessageWrapper({ children, fromMe }: MessageWrapperParams) {
    const before = fromMe
        ? 'before:content-[""] before:absolute before:right-[-10px] before:top-0 before:border-t-[0px] before:border-t-transparent before:border-l-[10px] before:border-l-[#d9fdd3] dark:before:border-l-[#144d37] before:border-b-[10px] before:border-b-transparent before:z-0 drop-shadow-sm'
        : 'before:content-[""] before:absolute before:left-[-10px] before:top-0 before:border-t-[0px] before:border-t-transparent before:border-r-[10px] before:border-r-background dark:before:border-r-zinc-900 before:border-b-[10px] before:border-b-transparent before:z-0 drop-shadow-sm'

    return (
        <Card
            className={cn(
                'relative p-0 border-0 shadow-none rounded-lg max-w-[60%] min-w-[115px]',
                fromMe
                    ? 'rounded-se-none bg-[#d9fdd3] dark:bg-[#144d37]'
                    : 'rounded-ss-none',
                before
            )}
        >
            <CardContent className='p-2'>{children}</CardContent>
        </Card>
    )
}

function MessageActions({ message }: { message: Message }) {
    const { setReplyMessage } = useContext(ChatsContext)
    const { fromMe } = message.sender

    const replyMessage = () => setReplyMessage(message)
    const copyMessage = async () => {
        try {
            const content = getBasicMessageContent(message.content)
            if (!content) return
            const messageTime = new Date(
                message.timestamp * 1000
            ).toLocaleTimeString()
            await navigator.clipboard.writeText(
                `[${message.sender.pushName} - ${messageTime}]: ${content}`
            )
            toast.success('Mensagem copiada')
        } catch (error) {
            console.log(error)
            toast.error('Não foi possível copiar mensagem')
        }
    }

    return (
        <div>
            <ForwardMessage msgId={message.id}>
                <button
                    id={`forward-${message.id}`}
                    className='hidden'
                />
            </ForwardMessage>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className='h-auto p-0 has-[>svg]:px-0 rounded-sm absolute top-0 right-1 invisible group-hover:visible'
                        variant='ghost'
                    >
                        <ChevronDown />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side={fromMe ? 'left' : 'right'}
                    sideOffset={10}
                    className='border-0 rounded-lg'
                >
                    <DropdownMenuItem onClick={replyMessage}>
                        <Reply /> Responder
                    </DropdownMenuItem>
                    <label htmlFor={`forward-${message.id}`}>
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

function getMessageContent(message: Message['content']) {
    const { type, content } = message
    if (type === 'text') return <SimpleTextMessage message={message} />
    else if (type === 'extendedText')
        return <ExtendedMessage message={message} />
    else if (type === 'image') return <ImageMessage message={message} />
    else if (type === 'video') return <VideoMessage message={message} />
    else if (type === 'audio') return <AudioPlayer src={content.url} />
    else if (type === 'sticker') return <StickerMessage message={message} />
    else if (type === 'document') return <DocumentMessage message={message} />
    else
        return (
            <p className='italic text-muted-foreground'>
                Tipo de mensagem ({type}) ainda em implementação
            </p>
        )
}
