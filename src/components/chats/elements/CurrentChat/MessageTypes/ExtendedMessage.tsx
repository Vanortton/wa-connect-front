import { formatWhatsAppText } from '@/helpers/format'
import type { IWebMessageInfo } from '@/types/BaileysTypes'

export default function ExtendedMessage({
    message,
}: {
    message: IWebMessageInfo
}) {
    const { message: content } = message
    if (!content.extendedTextMessage) return
    const { title, description, text, jpegThumbnail } =
        content.extendedTextMessage
    const thumbUrl = `url(data:image/jpeg;base64,${jpegThumbnail})`

    return (
        <div>
            {title && description && (
                <div className='bg-gray-500/10 p-2 rounded-md flex relative gap-2'>
                    {jpegThumbnail && (
                        <div>
                            <div
                                style={{ backgroundImage: thumbUrl }}
                                className='bg-center bg-cover rounded-md h-full min-w-[110px] min-h-[80px]'
                            />
                        </div>
                    )}
                    <div>
                        <h1 className='font-bold line-clamp-2'>{title}</h1>
                        <p className='text-sm text-muted-foreground line-clamp-3'>
                            {description}
                        </p>
                    </div>
                </div>
            )}
            <p className='mt-1 break-words'>{formatWhatsAppText(text)}</p>
        </div>
    )
}
