import { Button } from '@/components/ui/button'
import type { MessageContent } from '@/types/ChatsTypes'
import { Download, FileText } from 'lucide-react'

export default function DocumentMessage({
    message,
}: {
    message: MessageContent
}) {
    if (message.type !== 'document') return
    const { content } = message

    const downloadFile = () => {
        const link = document.createElement('a')
        link.href = content.url
        link.download = getFileName(content.url)
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div>
            <div className='flex gap-2 items-center p-2 bg-background/70 dark:bg-zinc-900/30 rounded-md mb-1'>
                <FileText
                    size={20}
                    className='text-blue-500'
                />
                <p>{getFileName(content.url)}</p>
                <Button
                    size='icon'
                    variant='outline'
                    onClick={downloadFile}
                >
                    <Download />
                </Button>
            </div>
            {content.caption && <p>{content.caption}</p>}
        </div>
    )
}

function getFileName(url: string) {
    const path = url.split('?')[0]
    const fileNameEncoded = path.substring(path.lastIndexOf('/') + 1)
    const fileName = decodeURIComponent(fileNameEncoded)

    const nameWithoutPrefix = fileName.includes('_')
        ? fileName.substring(fileName.indexOf('_') + 1)
        : fileName

    return nameWithoutPrefix
}
