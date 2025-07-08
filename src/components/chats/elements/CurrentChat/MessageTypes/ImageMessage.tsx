import { formatWhatsAppText } from '@/helpers/messages'
import type { MessageContent } from '@/types/ChatsTypes'

export default function ImageMessage({ message }: { message: MessageContent }) {
    if (message.type !== 'image') return
    const { content } = message

    return (
        <div>
            <img
                src={content.url}
                alt={`Anexo ${content.mimeType}`}
                className='max-w-[240px] max-h-[300px] rounded-md'
            />
            {content.caption && (
                <p className='break-words'>
                    {formatWhatsAppText(content.caption)}
                </p>
            )}
        </div>
    )
}
