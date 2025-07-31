import { formatWhatsAppText } from '@/helpers/format'
import type { IWebMessageInfo } from '@/types/BaileysTypes'

export default function SimpleTextMessage({
    message,
}: {
    message: IWebMessageInfo
}) {
    const { message: content } = message
    if (!content.conversation) return

    return (
        <div className='break-words'>
            {formatWhatsAppText(content.conversation)}
        </div>
    )
}
