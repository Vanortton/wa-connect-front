type TextType = string
type FileType = {
    document: string
    fileName: string
    mimeType: string
}
type MessageTypes = TextType | FileType

type NormalMessage = {
    jid: string
    type: 'text' | 'file'
    reply: string | null
} & { content: MessageTypes }

type ForwardMessage = {
    jids: string[]
    type: 'forward'
    content: {
        originJid: string
        msgId: string
    }
}

type SendMessage = NormalMessage | ForwardMessage

export type { FileType, SendMessage }
