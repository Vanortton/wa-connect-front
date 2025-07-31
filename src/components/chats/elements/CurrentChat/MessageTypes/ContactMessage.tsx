import type { IWebMessageInfo } from '@/types/BaileysTypes'
import { User } from 'lucide-react'

export default function ContactMessage({
    message,
}: {
    message: IWebMessageInfo
}) {
    const { message: content } = message
    if (!content.contactMessage) return
    const { displayName } = content.contactMessage

    return (
        <div className='px-2 py-1 bg-background/70 dark:bg-zinc-900/30 rounded-md flex gap-2 min-w-3xs items-center'>
            <User />
            <div>
                <p className='text-xs'>Contato</p>
                {displayName}
            </div>
        </div>
    )
}
