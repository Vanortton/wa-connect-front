import { Button } from '@/components/ui/button'
import { ChatsContext } from '@/contexts/ChatsContext'
import { cn } from '@/lib/utils'
import { useChatMessages } from '@/zustand/MessagesStore'
import { ChevronDown } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'

type ScrollBottomParams = {
    containerRef: React.RefObject<HTMLDivElement | null>
}

export default function ScrollBottom({ containerRef }: ScrollBottomParams) {
    const messages = useChatMessages((s) => s.messages)
    const [inBottom, setInBottom] = useState<boolean>(true)
    const { replyMessage } = useContext(ChatsContext)

    const scrollBottom = () => {
        const div = containerRef.current
        if (div) div.scrollTo(0, div.scrollHeight)
    }

    useEffect(() => {
        const div = containerRef.current
        if (!div) return

        const handleScroll = () => {
            const inBottom = div.scrollTop === 0
            setInBottom(inBottom)
        }

        div.addEventListener('scroll', handleScroll)
        return () => div.removeEventListener('scroll', handleScroll)
    }, [containerRef])

    useEffect(() => {
        const div = containerRef.current
        if (!div) return

        const scrollPosition = div.scrollTop + div.clientHeight
        const nearBottom = scrollPosition >= div.scrollHeight - 100
        if (nearBottom) scrollBottom()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerRef, messages])

    return (
        <>
            {!inBottom && (
                <Button
                    size='icon'
                    className={cn(
                        'fixed right-6 rounded-full bg-background hover:bg-background dark:bg-muted shadow-sm text-black dark:text-white size-10 text-foreground-muted',
                        replyMessage ? 'bottom-32' : 'bottom-24'
                    )}
                    onClick={scrollBottom}
                    type='button'
                >
                    <ChevronDown className='size-6' />
                </Button>
            )}
        </>
    )
}
