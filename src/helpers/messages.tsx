import type { MessageContent } from '@/types/ChatsTypes'
import React from 'react'

function formatWhatsAppText(text: string): React.ReactNode {
    const lines = text.split('\n')
    const elements: React.ReactNode[] = []

    let buffer: string[] = []
    let isInCodeBlock = false

    const flushParagraph = () => {
        if (buffer.length === 0) return
        const paragraph = buffer.join('\n')
        elements.push(
            <span key={elements.length}>
                {processInline(paragraph).map((part, i) => (
                    <React.Fragment key={i}>{part}</React.Fragment>
                ))}
            </span>
        )
        buffer = []
    }

    const processInline = (text: string): React.ReactNode[] => {
        const parts: React.ReactNode[] = []

        const regex =
            /(`[^`\n]+?`)|(\*[^*\n]+?\*)|(_[^_\n]+?_)|(~[^~\n]+?~)|(\bhttps?:\/\/[^\s<]+|\bwww\.[^\s<]+)/g
        let lastIndex = 0
        let match
        let key = 0

        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                const raw = text.slice(lastIndex, match.index)
                parts.push(
                    ...raw
                        .split('\n')
                        .flatMap((t, i, arr) =>
                            i < arr.length - 1 ? [t, <br key={key++} />] : [t]
                        )
                )
            }

            const [full] = match
            if (match[1])
                parts.push(<code key={key++}>{full.slice(1, -1)}</code>)
            else if (match[2])
                parts.push(<b key={key++}>{full.slice(1, -1)}</b>)
            else if (match[3])
                parts.push(<em key={key++}>{full.slice(1, -1)}</em>)
            else if (match[4])
                parts.push(<s key={key++}>{full.slice(1, -1)}</s>)
            else if (match[5]) {
                const href = full.startsWith('http') ? full : 'http://' + full
                parts.push(
                    <a
                        key={key++}
                        href={href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 dark:text-blue-500 underline'
                    >
                        {full}
                    </a>
                )
            }

            lastIndex = regex.lastIndex
        }

        if (lastIndex < text.length) {
            const rest = text.slice(lastIndex)
            parts.push(
                ...rest
                    .split('\n')
                    .flatMap((t, i, arr) =>
                        i < arr.length - 1 ? [t, <br key={key++} />] : [t]
                    )
            )
        }

        return parts
    }

    let currentList: { items: string[]; ordered: boolean } | null = null

    const flushList = () => {
        if (!currentList) return
        const Tag = currentList.ordered ? 'ol' : 'ul'
        elements.push(
            <Tag key={elements.length}>
                {currentList.items.map((item, i) => (
                    <li key={i}>{processInline(item)}</li>
                ))}
            </Tag>
        )
        currentList = null
    }

    for (const line of lines) {
        const trimmed = line.trim()

        if (trimmed.startsWith('```')) {
            if (isInCodeBlock) {
                elements.push(
                    <pre key={elements.length}>
                        <code>{buffer.join('\n')}</code>
                    </pre>
                )
                buffer = []
                isInCodeBlock = false
            } else {
                flushParagraph()
                flushList()
                isInCodeBlock = true
            }
            continue
        }

        if (isInCodeBlock) {
            buffer.push(line)
            continue
        }

        const quoteMatch = line.match(/^>\s+(.+)/)
        if (quoteMatch) {
            flushParagraph()
            flushList()
            elements.push(
                <blockquote key={elements.length}>
                    {processInline(quoteMatch[1])}
                </blockquote>
            )
            continue
        }

        const orderedMatch = line.match(/^(\d+)\.\s+(.+)/)
        if (orderedMatch) {
            flushParagraph()
            if (!currentList || !currentList.ordered) {
                flushList()
                currentList = { items: [], ordered: true }
            }
            currentList.items.push(orderedMatch[2])
            continue
        }

        const unorderedMatch = line.match(/^[-*]\s+(.+)/)
        if (unorderedMatch) {
            flushParagraph()
            if (!currentList || currentList.ordered) {
                flushList()
                currentList = { items: [], ordered: false }
            }
            currentList.items.push(unorderedMatch[1])
            continue
        }

        if (trimmed === '') {
            flushParagraph()
            flushList()
            continue
        }

        buffer.push(line)
    }

    flushParagraph()
    flushList()
    if (isInCodeBlock && buffer.length > 0) {
        elements.push(
            <pre key={elements.length}>
                <code>{buffer.join('\n')}</code>
            </pre>
        )
    }

    return <>{elements}</>
}

function removeWhatsAppFormatting(text: string): string {
    // Remove blocos de código ```texto```
    text = text.replace(/```([\s\S]*?)```/g, (_, p1) => p1.trim())

    // Remove código inline `texto`
    text = text.replace(/`([^`\n]+?)`/g, (_, p1) => p1)

    // Remove itálico _texto_
    text = text.replace(/_(.+?)_/g, (_, p1) => p1)

    // Remove negrito *texto*
    text = text.replace(/\*(.+?)\*/g, (_, p1) => p1)

    // Remove rasurado ~texto~
    text = text.replace(/~(.+?)~/g, (_, p1) => p1)

    // Remove citação > texto (mas mantém o texto)
    text = text.replace(/^> (.+)$/gm, (_, p1) => p1)

    // Remove prefixos de lista numerada (1. texto)
    text = text.replace(/^\d+\.\s+/gm, '')

    // Remove prefixos de lista com marcador (* texto ou - texto)
    text = text.replace(/^(\*|-)\s+/gm, '')

    return text
}

function getBasicMessageContent(message: MessageContent) {
    const { type, content } = message
    if (type === 'text') return content.text
    else if (type === 'extendedText') return content.text
}

export { formatWhatsAppText, getBasicMessageContent, removeWhatsAppFormatting }
