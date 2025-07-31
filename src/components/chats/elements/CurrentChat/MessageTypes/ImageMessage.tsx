import { Button } from '@/components/ui/button'
import { ChatsContext } from '@/contexts/ChatsContext'
import { formatWhatsAppText } from '@/helpers/format'
import { mimeTypeToExt } from '@/helpers/messages'
import useMessages from '@/hooks/use-messages'
import type { IWebMessageInfo } from '@/types/BaileysTypes'
import { useChatMessages } from '@/zustand/MessagesStore'
import { Download, Loader2Icon } from 'lucide-react'
import { useContext, useState } from 'react'
import { toast } from 'sonner'

type RenderImageParams = {
    message: IWebMessageInfo
    downloadUrl: string
}

export default function ImageMessage({
    message,
}: {
    message: IWebMessageInfo
}) {
    const { message: content } = message
    if (!content.imageMessage) return null

    const { caption, downloadUrl } = content.imageMessage

    return (
        <div className='relative w-fit max-w-[240px]'>
            <RenderImage
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

export function RenderImage({ message }: RenderImageParams) {
    const { retryDownload, downloadMedia } = useMessages()
    const { socketRef } = useContext(ChatsContext)
    const [loading, setLoading] = useState(false)
    const [showPreview, setShowPreview] = useState<boolean>(true)
    const updateMessage = useChatMessages((s) => s.updateMessage)

    const { message: content } = message
    if (!content.imageMessage) return null
    const { jpegThumbnail, mimetype, downloadUrl } = content.imageMessage
    const thumbnailSrc = `data:image/${mimetype};base64,${jpegThumbnail}`

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
                            imageMessage: {
                                ...message.message.imageMessage,
                                downloadUrl,
                            },
                        },
                    }),
                })
            } else await retryDownload(socketRef.current, message, 'image')

            setShowPreview(false)
        } catch (err) {
            toast.error('Não foi possível baixar imagem')
            console.error('Erro ao baixar imagem:', err)
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
                                <Download size={16} />
                            )}
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <img
                        src={downloadUrl}
                        alt='Preview da imagem'
                        className='max-w-[240px] max-h-[300px] rounded-md'
                    />
                    <Button
                        size='icon'
                        variant='outline'
                        className='absolute right-1 top-1 size-6'
                        type='button'
                        onClick={() =>
                            downloadMedia(
                                downloadUrl,
                                `wa_image_${Date.now()}.${mimeTypeToExt(
                                    mimetype
                                )}`
                            )
                        }
                    >
                        <Download
                            className='size-3'
                            strokeWidth={3}
                        />
                    </Button>
                </>
            )}
        </div>
    )
}
