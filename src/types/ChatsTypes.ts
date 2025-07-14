type MediaType = 'image' | 'video' | 'audio' | 'document' | 'sticker'

type MessageType = 'text' | 'extendedText' | MediaType

type MediaContent = {
    url: string
    mimeType: string
    caption: string
}

type TextContent = {
    text: string
}

type ExtendedTextContent = {
    thumbnail: Uint8Array | Buffer | { data: Buffer }
    title: string
    description: string
    text: string
}

type ReplyData = (MessageContent & { id?: string }) | null

type MessageContent =
    | { type: 'text'; content: TextContent; reply: ReplyData }
    | {
          type: 'extendedText'
          content: ExtendedTextContent
          reply: ReplyData
      }
    | { type: MediaType; content: MediaContent; reply: ReplyData }
    | { type: 'unknown'; content: null; reply: ReplyData }

type SenderInfo = {
    fromMe: boolean | null
    participant?: string | null
    pushName: string | null
}

type Message = {
    id: string
    chatId: string
    sender: SenderInfo
    timestamp: number
    status: number
    content: MessageContent
}

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
    lastMessage: Message
    unreadMessages: number
    infosLoaded: boolean
}

type QuickMessage = {
    shortcut: string
    text: string
}

export type {
    Chat,
    MediaType,
    Message,
    MessageContent,
    MessageType,
    QuickMessage,
    SenderInfo,
}
