import { formatWhatsAppText } from '@/helpers/messages'
import type { MessageContent } from '@/types/ChatsTypes'

export default function SimpleTextMessage({
    message,
}: {
    message: MessageContent
}) {
    if (message.type !== 'text') return
    const { content } = message
    return (
        <p
            dangerouslySetInnerHTML={{
                __html: formatWhatsAppText(content.text),
            }}
        ></p>
    )
}
