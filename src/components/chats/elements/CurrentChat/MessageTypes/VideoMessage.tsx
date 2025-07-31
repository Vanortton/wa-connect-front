import { Button } from '@/components/ui/button'
import { ChatsContext } from '@/contexts/ChatsContext'
import { formatWhatsAppText } from '@/helpers/format'
import useMessages from '@/hooks/use-messages'
import type { IWebMessageInfo } from '@/types/BaileysTypes'
import { useChatMessages } from '@/zustand/MessagesStore'
import { Loader2Icon, Play } from 'lucide-react'
import { useContext, useState } from 'react'
import { toast } from 'sonner'

type RenderVideoParams = {
    message: IWebMessageInfo
    downloadUrl: string
}

export default function VideoMessage({
    message,
}: {
    message: IWebMessageInfo
}) {
    const { message: content } = message
    if (!content.videoMessage) return null

    const { caption, downloadUrl } = content.videoMessage

    return (
        <div className='relative w-fit max-w-[240px]'>
            <RenderVideo
                message={message}
                downloadUrl={downloadUrl}
            />

            {caption && (
                <p className='mt-2 text-sm break-words'>
                    {formatWhatsAppText(caption)}
                </p>
            )}
        </div>
    )
}

export function RenderVideo({ message }: RenderVideoParams) {
    const { retryDownload } = useMessages()
    const { socketRef } = useContext(ChatsContext)
    const [loading, setLoading] = useState(false)
    const [showPreview, setShowPreview] = useState<boolean>(true)
    const updateMessage = useChatMessages((s) => s.updateMessage)

    const { message: content } = message
    if (!content.videoMessage) return null

    const { jpegThumbnail, mimetype, downloadUrl } = content.videoMessage
    const thumbnailSrc = jpegThumbnail
        ? `data:image/${mimetype};base64,${jpegThumbnail}`
        : undefined

    async function handleDownload() {
        try {
            setLoading(true)

            if (!socketRef.current) return

            if (downloadUrl) {
                updateMessage({
                    id: message.key.id,
                    data: () => ({
                        ...message,
                        message: {
                            ...message.message,
                            videoMessage: {
                                ...message.message.videoMessage,
                                downloadUrl,
                            },
                        },
                    }),
                })
            } else {
                await retryDownload(socketRef.current, message, 'video').then(
                    (msg) => updateMessage(msg)
                )
            }

            setShowPreview(false)
        } catch (err) {
            toast.error('Não foi possível baixar o vídeo')
            console.error('Erro ao baixar vídeo:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='relative'>
            {showPreview ? (
                <>
                    <div
                        style={{ backgroundImage: `url(${thumbnailSrc})` }}
                        className='w-[240px] h-[300px] max-w-[240px] max-h-[300px] bg-center bg-cover rounded-md'
                    ></div>
                    <div className='w-[240px] h-[300px] max-w-[240px] max-h-[300px] rounded-md bg-transparent backdrop-blur-sm absolute top-0 left-0 flex items-center justify-center'>
                        <Button
                            size='icon'
                            className='bg-muted hover:bg-muted/70 rounded-full text-foreground'
                            onClick={handleDownload}
                            type='button'
                        >
                            {loading ? (
                                <Loader2Icon className='animate-spin' />
                            ) : (
                                <Play size={16} />
                            )}
                        </Button>
                    </div>
                </>
            ) : (
                <video
                    src={downloadUrl}
                    controls
                    className='max-w-[240px] max-h-[300px] rounded-md object-contain'
                />
            )}
        </div>
    )
}
