import { Textarea } from '@/components/ui/textarea'
import { useRef } from 'react'

type MessageTextareaParams = {
    text: string
    setText: (v: string) => void
    submit: () => void
}

export default function MessageTextarea({
    text,
    setText,
    submit,
}: MessageTextareaParams) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit()
        }
    }

    return (
        <Textarea
            ref={textareaRef}
            className='resize-none min-h-0 max-h-[100px] text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 scrollbar-transparent bg-transparent dark:bg-transparent shadow-none p-0 rounded-none'
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={0}
        />
    )
}
