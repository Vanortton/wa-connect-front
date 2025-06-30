import type { MessageContent } from '@/types/ChatsTypes'

export default function StickerMessage({
    message,
}: {
    message: MessageContent
}) {
    if (message.type !== 'sticker') return
    const { content } = message

    return (
        <img
            src={content.url}
            alt='Figurinha'
            className='w-[120px] h-auto rounded-md'
        />
    )
}
