import { Button } from '@/components/ui/button'
import { messageType } from '@/helpers/messages'
import useMessages from '@/hooks/use-messages'
import type {
    IWebMessageInfo,
    MediaMessageContents,
} from '@/types/BaileysTypes'
import { useChatsStore } from '@/zustand/ChatsStore'
import { useChatMessages } from '@/zustand/MessagesStore'
import { Copy, Download, ReplyAll as Forward, Trash } from 'lucide-react'
import { toast } from 'sonner'

export default function SelectionActions({
    checked,
    onCancel,
}: {
    checked: string[]
    onCancel: () => void
}) {
    const { downloadZipMedia } = useMessages()
    const currentChat = useChatsStore((s) => s.currentChat)

    const handleDownloadZip = async () => {
        if (!currentChat) {
            toast.error('Nenhuma conversa selecionada')
            return
        }
        const { messages } = useChatMessages.getState()

        const mediaCheckedMsgs = messages
            .filter((doc) => {
                const msg = doc.data() as IWebMessageInfo

                const mediaTypes = ['audio', 'image', 'video', 'document']
                const msgIsChecked = checked.includes(msg.key.id)

                const msgType = messageType(msg.message)
                const isMediaMessage = mediaTypes.includes(msgType)

                const msgContent = msg.message[
                    `${msgType}Message` as keyof IWebMessageInfo['message']
                ] as MediaMessageContents
                if (!msgContent || typeof msgContent === 'string') return false
                const mediaIsDownloaded = msgContent.downloadUrl

                if (msgIsChecked) console.log(msgContent)

                return msgIsChecked && isMediaMessage && mediaIsDownloaded
            })
            .map((doc) => {
                const msg = doc.data() as IWebMessageInfo
                return msg.key.id
            })

        if (!mediaCheckedMsgs.length)
            return toast.error('Baixe os arquivos primeiro para poder baixar')

        await downloadZipMedia(currentChat, mediaCheckedMsgs)
        onCancel()
    }

    return (
        <div className='flex items-center justify-between bg-background dark:bg-zinc-900 py-3 px-4 shadow-sm z-20'>
            <div className='flex items-center just gap-2'>
                {checked.length} selecionadas
            </div>
            <div className='flex items-center just gap-2'>
                <Button
                    size='icon'
                    variant='ghost'
                    disabled={true}
                >
                    <Copy />
                </Button>
                <Button
                    size='icon'
                    variant='ghost'
                    disabled={true}
                >
                    <Forward className='icon-h-flip' />
                </Button>
                <Button
                    size='icon'
                    variant='ghost'
                    onClick={handleDownloadZip}
                >
                    <Download />
                </Button>
                <Button
                    size='icon'
                    variant='ghost'
                    disabled={true}
                >
                    <Trash />
                </Button>
                <Button
                    variant='outline'
                    onClick={onCancel}
                >
                    Cancelar
                </Button>
            </div>
        </div>
    )
}
