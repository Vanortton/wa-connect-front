import AudioPlayer from '@/components/ui/audio-player'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChatsContext } from '@/contexts/ChatsContext'
import { cn } from '@/lib/utils'
import type { Message } from '@/types/ChatsTypes'
import { ArrowDown } from 'lucide-react'
import { useContext, useRef, type ReactNode } from 'react'
import DocumentMessage from './MessageTypes/DocumentMessage'
import ExtendedMessage from './MessageTypes/ExtendedMessage'
import ImageMessage from './MessageTypes/ImageMessage'
import SimpleTextMessage from './MessageTypes/SimpleTextMessage'
import StickerMessage from './MessageTypes/StikerMessage'
import VideoMessage from './MessageTypes/VideoMessage'

type MessageItemParams = { message: Message }
type MessageWrapperParams = { children: ReactNode; fromMe: boolean }

export default function ChatMessages() {
    const { currentChatMsgs } = useContext(ChatsContext)
    const containerRef = useRef<HTMLDivElement | null>(null)

    const scrollBottom = () => {
        const div = containerRef.current
        if (div) div.scrollTo(0, div.scrollHeight)
    }

    return (
        <div
            className='flex-1 overflow-y-auto scroll-smooth scrollbar-transparent p-5 min-h-0 flex flex-col gap-3'
            ref={containerRef}
        >
            {currentChatMsgs.map((msg) => {
                if (msg.content.type === 'unknown') return
                return (
                    <MessageItem
                        message={msg}
                        key={msg.id}
                    />
                )
            })}
            <Button
                size='icon'
                className='fixed bottom-20 right-6 rounded-full border-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-black dark:text-white'
                onClick={scrollBottom}
            >
                <ArrowDown />
            </Button>
        </div>
    )
}

function MessageItem({ message }: MessageItemParams) {
    const sendTime = new Date(message.timestamp * 1000).toLocaleTimeString()

    return (
        <div
            className={cn(
                'w-full flex',
                message.sender.fromMe ? 'justify-end' : 'justify-start'
            )}
        >
            <MessageWrapper fromMe={message.sender.fromMe || false}>
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
        ? 'before:content-[""] before:absolute before:right-[-10px] before:top-0 before:border-t-[0px] before:border-t-transparent before:border-l-[10px] before:border-l-[#d9fdd3] dark:before:border-l-[#144d37] before:border-b-[10px] before:border-b-transparent before:z-0 drop-shadow-xs'
        : 'before:content-[""] before:absolute before:left-[-10px] before:top-0 before:border-t-[0px] before:border-t-transparent before:border-r-[10px] before:border-r-background dark:before:border-r-zinc-900 before:border-b-[10px] before:border-b-transparent before:z-0 drop-shadow-xs'

    return (
        <Card
            className={cn(
                'p-0 border-0 shadow-none rounded-lg max-w-[60%]',
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
