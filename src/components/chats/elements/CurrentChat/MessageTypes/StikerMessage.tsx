import { ChatsContext } from '@/contexts/ChatsContext'
import useMessages from '@/hooks/use-messages'
import type { IWebMessageInfo } from '@/types/BaileysTypes'
import { useChatMessages } from '@/zustand/MessagesStore'
import { Loader2Icon } from 'lucide-react'
import { useContext, useEffect } from 'react'

export default function StickerMessage({
    message,
}: {
    message: IWebMessageInfo
}) {
    const { retryDownload } = useMessages()
    const { socketRef } = useContext(ChatsContext)
    const { message: content } = message
    const updateMessage = useChatMessages((s) => s.updateMessage)

    const { downloadUrl } = content.stickerMessage || {}

    useEffect(() => {
        if (!downloadUrl && socketRef.current)
            retryDownload(socketRef.current, message, 'sticker').then((msg) =>
                updateMessage(msg)
            )
    }, [downloadUrl, message, retryDownload, socketRef, updateMessage])

    if (!content.stickerMessage) return null
    return (
        <>
            {downloadUrl ? (
                <img
                    src={downloadUrl}
                    alt='Figurinha'
                    className='w-[120px] h-auto rounded-md'
                />
            ) : (
                <div className='w-[120px] h-[120px] flex items-center justify-center bg-muted rounded-md text-muted-foreground'>
                    <Loader2Icon className='animate-spin' />
                </div>
            )}
        </>
    )
}
