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

type FilesTypes = 'document' | 'image-video' | 'audio'
type SelectedFile = { file: File; type: FilesTypes; caption?: string }

export type { FilesTypes, FileType, SelectedFile, SendMessage }
