import { Button } from '@/components/ui/button'
import { ChatsContext } from '@/contexts/ChatsContext'
import { formatWhatsAppText } from '@/helpers/format'
import useMessages from '@/hooks/use-messages'
import type { IWebMessageInfo } from '@/types/BaileysTypes'
import { Download, FileText, Loader2Icon } from 'lucide-react'
import { useContext, useState } from 'react'
import { toast } from 'sonner'

export default function DocumentMessage({
    message,
}: {
    message: IWebMessageInfo
}) {
    const { retryDownload } = useMessages()
    const { message: content } = message
    const { socketRef } = useContext(ChatsContext)
    const [loading, setLoading] = useState(false)

    if (!content.documentMessage) return null

    const { fileName, downloadUrl, caption, mimetype, fileLength, pageCount } =
        content.documentMessage

    async function handleDownload() {
        if (!socketRef.current) {
            toast.error('Socket não conectado.')
            return
        }

        setLoading(true)

        try {
            let finalDownloadUrl = downloadUrl

            if (!finalDownloadUrl) {
                const msg = await retryDownload(
                    socketRef.current,
                    message,
                    'document'
                )
                const msgData = msg.data()
                finalDownloadUrl =
                    msgData.message.documentMessage?.downloadUrl || ''

                if (!finalDownloadUrl) {
                    toast.error('Não foi possível obter URL de download.')
                    setLoading(false)
                    return
                }
            }

            const res = await fetch(finalDownloadUrl)
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = url
            a.download = fileName || 'documento'
            document.body.appendChild(a)
            a.click()
            a.remove()

            URL.revokeObjectURL(url)
        } catch (err) {
            console.error('Erro ao baixar documento:', err)
            toast.error('Falha ao baixar documento.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className='flex gap-4 items-center p-2 bg-background/70 dark:bg-zinc-900/30 rounded-md mb-1'>
                <FileText
                    size={20}
                    className='text-blue-500'
                />
                <div className='flex flex-col flex-1'>
                    <p className='text-sm'>
                        {fileName}{' '}
                        {pageCount && (
                            <span className='text-xs text-muted-foreground'>
                                ({pageCount} páginas)
                            </span>
                        )}
                    </p>
                    <span className='text-xs text-muted-foreground'>
                        {mimetype} • {formatBytes(fileLength)}
                    </span>
                </div>
                <Button
                    size='icon'
                    variant='outline'
                    onClick={handleDownload}
                    disabled={loading}
                    type='button'
                >
                    {loading ? (
                        <Loader2Icon className='animate-spin' />
                    ) : (
                        <Download size={16} />
                    )}
                </Button>
            </div>
            {caption && (
                <p className='text-sm break-words'>
                    {formatWhatsAppText(caption)}
                </p>
            )}
        </div>
    )
}

function formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let i = 0

    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024
        i++
    }

    return `${bytes?.toFixed(bytes < 1024 ? 0 : 1)} ${units[i]}`
}
