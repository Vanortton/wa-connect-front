import type { MessageContent } from '@/types/ChatsTypes'

export default function ReplyPreview({ message }: { message: MessageContent }) {
    const { reply } = message

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
        if (!reply?.id) return
        const container = document.getElementById('msgs-container')
        const message = document.getElementById(reply.id)
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

            highlightMessage(reply.id)
        }
    }

    if (!reply?.type) return ''
    return (
        <div
            className='bg-muted py-1 px-2 rounded-md my-1 border-l-3 border-emerald-500 shadow-sm cursor-pointer'
            onClick={scrollToMsg}
        >
            {getMessageContent(reply)}
        </div>
    )
}

function getMessageContent(message: MessageContent) {
    const { type, content } = message
    if (type === 'text') return content.text
    else if (type === 'extendedText') return content.text
}
