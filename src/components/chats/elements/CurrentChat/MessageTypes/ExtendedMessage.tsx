import { formatWhatsAppText } from '@/helpers/messages'
import type { MessageContent } from '@/types/ChatsTypes'

export default function ExtendedMessage({
    message,
}: {
    message: MessageContent
}) {
    if (message.type !== 'extendedText') return
    const { content } = message
    const { title, description, text } = content

    return (
        <div>
            {title && description && (
                <div className='bg-gray-500/10 p-2 rounded-md'>
                    <h1 className='font-bold line-clamp-2'>{title}</h1>
                    <p className='text-sm text-muted-foreground line-clamp-3'>
                        {description}
                    </p>
                </div>
            )}
            <p
                className='mt-1 break-words'
                dangerouslySetInnerHTML={{ __html: formatWhatsAppText(text) }}
            ></p>
        </div>
    )
}
