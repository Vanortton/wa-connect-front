import { formatWhatsAppText } from '@/helpers/messages'
import type { MessageContent } from '@/types/ChatsTypes'

export default function VideoMessage({ message }: { message: MessageContent }) {
    if (message.type !== 'video') return
    const { content } = message

    return (
        <div className='max-w-[240px]'>
            <div className='flex w-full h-full'>
                <video
                    src={content.url}
                    controls
                    className='rounded-md max-w-full max-h-full object-contain'
                />
            </div>
            {content.caption && (
                <p className='break-words'>
                    {formatWhatsAppText(content.caption)}
                </p>
            )}
        </div>
    )
}
