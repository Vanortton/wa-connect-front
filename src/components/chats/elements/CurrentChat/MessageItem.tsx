import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { getMessageContent, messageType } from '@/helpers/messages'
import { cn } from '@/lib/utils'
import type { IWebMessageInfo } from '@/types/BaileysTypes'
import type { DocumentData } from 'firebase/firestore'
import React, { type ReactNode } from 'react'
import MessageActions from './MessageActions'
import ReplyPreview from './MessageTypes/ReplyPreview'

type MessageItemParams = { message: DocumentData; isGroup: boolean }
type MessageWrapperParams = { children: ReactNode; fromMe: boolean }

function MessageItem({ message, isGroup }: MessageItemParams) {
    const msg = message.data() as IWebMessageInfo
    const type = messageType(msg.message)
    const msgTime = msg.messageTimestamp

    const sendTime = new Date(msgTime * 1000).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    })

    const messageContent =
        msg?.message?.[`${type}Message` as keyof IWebMessageInfo['message']]
    const repliedMsg =
        typeof messageContent === 'string'
            ? null
            : messageContent?.contextInfo?.quotedMessage
    const repliedId =
        typeof messageContent === 'string'
            ? null
            : messageContent?.contextInfo?.stanzaId

    console.log('ATUALIZANDO MENSAGEM', msg)

    return (
        <div
            className='w-full relative group'
            id={msg.key.id}
        >
            <label
                className='w-full flex items-center gap-8 px-5 py-1 w-full h-full highlight block message-highlight'
                htmlFor={`selector-${msg.key.id}`}
            >
                <Checkbox
                    className='z-40 size-5 bg-background border-foreground/30 message-checkbox'
                    id={`selector-${msg.key.id}`}
                    name='selected-message'
                    value={msg.key.id}
                />

                <div
                    className={cn(
                        'w-full flex group items-center gap-3 justify-end',
                        !msg.key.fromMe && 'justify-end flex-row-reverse'
                    )}
                >
                    <MessageActions message={msg} />
                    <MessageWrapper fromMe={msg.key.fromMe || false}>
                        {isGroup && (
                            <div className='text-xs text-muted-foreground'>
                                ~ {msg.pushName}
                            </div>
                        )}
                        {repliedMsg && (
                            <ReplyPreview
                                message={repliedMsg}
                                id={repliedId || ''}
                            />
                        )}
                        {getMessageContent(msg)}
                        <div className='flex justify-end text-xs text-muted-foreground'>
                            {sendTime}
                        </div>
                    </MessageWrapper>
                </div>
            </label>
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

export default React.memo(MessageItem)
