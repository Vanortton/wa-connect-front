import { getLastMessageContent } from '@/helpers/chatsList'
import type { IMessage, IWebMessageInfo } from '@/types/BaileysTypes'

export default function ReplyPreview({
    message,
    id,
}: {
    message: IMessage
    id: string
}) {
    const highlightMessage = (msgId: string) => {
        const message = document.getElementById(msgId)
        if (!message) return

        message.classList.add('highlighted-message')

        message.addEventListener(
            'animationend',
            () => {
                message.classList.remove('highlighted-message')
            },
            { once: true }
        )
    }

    const scrollToMsg = () => {
        if (!id) return
        const container = document.getElementById('msgs-container')
        const message = document.getElementById(id)
        if (container && message) {
            const messageOffsetTop = message.offsetTop
            const containerHeight = container.clientHeight
            const messageHeight = message.clientHeight
            const scrollPosition =
                messageOffsetTop - containerHeight + messageHeight

            container.scrollTo({
                top: scrollPosition,
                behavior: 'smooth',
            })

            highlightMessage(id)
        }
    }

    return (
        <div
            className='bg-muted py-1 px-2 rounded-sm my-1 border-l-6 border-emerald-500 shadow-sm cursor-pointer break-all line-clamp-1'
            onClick={scrollToMsg}
        >
            {getLastMessageContent({ message } as IWebMessageInfo)}
        </div>
    )
}
