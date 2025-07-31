import AudioMessage from '@/components/chats/elements/CurrentChat/MessageTypes/AudioMessage'
import ContactMessage from '@/components/chats/elements/CurrentChat/MessageTypes/ContactMessage'
import DeletedMessage from '@/components/chats/elements/CurrentChat/MessageTypes/DeletedMessage'
import DocumentMessage from '@/components/chats/elements/CurrentChat/MessageTypes/DocumentMessage'
import ExtendedMessage from '@/components/chats/elements/CurrentChat/MessageTypes/ExtendedMessage'
import ImageMessage from '@/components/chats/elements/CurrentChat/MessageTypes/ImageMessage'
import LocationMessage from '@/components/chats/elements/CurrentChat/MessageTypes/LocationMessage'
import SimpleTextMessage from '@/components/chats/elements/CurrentChat/MessageTypes/SimpleTextMessage'
import StickerMessage from '@/components/chats/elements/CurrentChat/MessageTypes/StikerMessage'
import VideoMessage from '@/components/chats/elements/CurrentChat/MessageTypes/VideoMessage'
import type { IMessage, IWebMessageInfo } from '@/types/BaileysTypes'

function getMessageContent(message: IWebMessageInfo) {
    const type = messageType(message.message)

    if (message.deleted) return <DeletedMessage />
    if (type === 'text') return <SimpleTextMessage message={message} />
    if (type === 'extendedText') return <ExtendedMessage message={message} />
    if (type === 'image') return <ImageMessage message={message} />
    if (type === 'video') return <VideoMessage message={message} />
    else if (type === 'audio') return <AudioMessage message={message} />
    if (type === 'sticker') return <StickerMessage message={message} />
    else if (type === 'document') return <DocumentMessage message={message} />
    if (type === 'contact') return <ContactMessage message={message} />
    if (type === 'location') return <LocationMessage message={message} />

    return (
        <p className='italic text-muted-foreground'>
            Tipo de mensagem ({type}) ainda em implementação
        </p>
    )
}

function messageType(message: IMessage) {
    if (message?.conversation != null) return 'text'
    if (message?.extendedTextMessage != null) return 'extendedText'
    if (message?.imageMessage != null) return 'image'
    if (message?.videoMessage != null) return 'video'
    if (message?.audioMessage != null) return 'audio'
    if (message?.documentMessage != null) return 'document'
    if (message?.locationMessage != null) return 'location'
    if (message?.stickerMessage != null) return 'sticker'
    if (message?.contactMessage != null) return 'contact'
    if (message?.reactionMessage != null) return 'reaction'
    if (message?.protocolMessage != null) return 'update'
    return 'unknown'
}

function decodeWaveform(base64?: string): number[] | null {
    if (!base64) return null
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }
    return Array.from(bytes)
}

function mimeTypeToExt(mime: string) {
    const map: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/bmp': 'bmp',
        'image/svg+xml': 'svg',

        'video/mp4': 'mp4',
        'video/webm': 'webm',
        'video/ogg': 'ogv',

        'audio/mpeg': 'mp3',
        'audio/ogg': 'ogg',
        'audio/wav': 'wav',
        'audio/webm': 'weba',

        'application/pdf': 'pdf',
        'application/zip': 'zip',
        'application/x-rar-compressed': 'rar',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            'xlsx',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            'docx',
        'application/vnd.ms-powerpoint': 'ppt',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            'pptx',

        'text/plain': 'txt',
        'text/html': 'html',
        'application/json': 'json',
        'application/javascript': 'js',
        'text/css': 'css',
    }

    return map[mime] || ''
}

export { decodeWaveform, getMessageContent, messageType, mimeTypeToExt }

