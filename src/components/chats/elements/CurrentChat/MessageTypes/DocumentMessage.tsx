import { Button } from '@/components/ui/button'
import { downloadFile, getFileName } from '@/helpers/files'
import type { MessageContent } from '@/types/ChatsTypes'
import { Download, FileText } from 'lucide-react'

export default function DocumentMessage({
    message,
}: {
    message: MessageContent
}) {
    if (message.type !== 'document') return
    const { content } = message

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
                    onClick={() => downloadFile(content.url)}
                >
                    <Download />
                </Button>
            </div>
            {content.caption && <p>{content.caption}</p>}
        </div>
    )
}
