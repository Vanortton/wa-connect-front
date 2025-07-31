import type { IWebMessageInfo } from '@/types/BaileysTypes'
import type { MediaType, OthersTypes } from '@/types/ChatsTypes'
import { File, Image, MapPin, Mic, Sticker, User, Video } from 'lucide-react'
import { removeWhatsAppFormatting } from './format'
import { messageType } from './messages'

function getLastMessageContent(message: IWebMessageInfo) {
    const { message: msg } = message
    const type = messageType(msg)

    const otherType =
        type === 'image' ||
        type === 'video' ||
        type === 'audio' ||
        type === 'document' ||
        type === 'sticker' ||
        type === 'contact' ||
        type === 'location'

    if (type === 'text')
        return removeWhatsAppFormatting(msg?.conversation || '')
    else if (type === 'extendedText')
        return removeWhatsAppFormatting(msg.extendedTextMessage?.text || '')
    else if (otherType) return replaceType(type)
    else return 'Mensagem não disponível'
}

function replaceType(type: MediaType | OthersTypes) {
    const description = { className: 'flex items-center gap-1' }
    const iconConfig = { size: 12, strokeWidth: 3 }

    switch (type) {
        case 'image':
            return (
                <span {...description}>
                    <Image {...iconConfig} />
                    Imagem
                </span>
            )
        case 'video':
            return (
                <span {...description}>
                    <Video {...iconConfig} />
                    Vídeo
                </span>
            )
        case 'audio':
            return (
                <span {...description}>
                    <Mic {...iconConfig} />
                    Audio
                </span>
            )
        case 'document':
            return (
                <span {...description}>
                    <File {...iconConfig} />
                    Arquivo
                </span>
            )
        case 'sticker':
            return (
                <span {...description}>
                    <Sticker {...iconConfig} />
                    Figurinha
                </span>
            )
        case 'contact':
            return (
                <span {...description}>
                    <User {...iconConfig} />
                    Contato
                </span>
            )
        case 'location':
            return (
                <span {...description}>
                    <MapPin {...iconConfig} />
                    Localização
                </span>
            )
        default:
            return 'Mensagem não disponível'
    }
}

function getContrastColor(hex: string): 'black' | 'white' {
    hex = hex.replace('#', '')

    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    return luminance > 0.5 ? 'black' : 'white'
}

export { getContrastColor, getLastMessageContent }
