import type { IWebMessageInfo } from './BaileysTypes'

type MediaType = 'image' | 'video' | 'audio' | 'document' | 'sticker'

type OthersTypes = 'contact' | 'location'

type MessageType = 'text' | 'extendedText' | MediaType

type AttendingBy = {
    token: string
    name: string
} | null

type Chat = {
    name: string
    photo: string | null
    id: string
    isGroup: boolean
    attendingBy?: AttendingBy
    lastReadTimestamp?: number
    lastMessage: IWebMessageInfo
    unreadMessages: number
    current: boolean
    labelId: number
}

type QuickMessage = {
    shortcut: string
    text: string
}

export type { Chat, MediaType, MessageType, OthersTypes, QuickMessage }
