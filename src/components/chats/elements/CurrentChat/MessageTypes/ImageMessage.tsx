import { Button } from '@/components/ui/button'
import { downloadFile } from '@/helpers/files'
import { formatWhatsAppText } from '@/helpers/messages'
import type { MessageContent } from '@/types/ChatsTypes'
import { Download } from 'lucide-react'

export default function ImageMessage({ message }: { message: MessageContent }) {
    if (message.type !== 'image') return
    const { content } = message

    return (
        <div className='relative'>
            <img
                src={content.url}
                alt={`Anexo ${content.mimeType}`}
                className='max-w-[240px] max-h-[300px] rounded-md'
            />
            <Button
                size='icon'
                className='bg-background dark:bg-muted rounded-full absolute top-2 right-2 text-foreground'
                onClick={() => downloadFile(content.url)}
            >
                <Download />
            </Button>
            {content.caption && (
                <p
                    className='break-words'
                    dangerouslySetInnerHTML={{
                        __html: formatWhatsAppText(content.caption),
                    }}
                ></p>
            )}
        </div>
    )
}
