import { Button } from '@/components/ui/button'
import { ChatsContext } from '@/contexts/ChatsContext'
import { STORE_URL } from '@/globals'
import type { SelectedFile } from '@/types/SendMessageTypes'
import { useChatsStore } from '@/zustand/ChatsStore'
import axios from 'axios'
import { SendHorizontal } from 'lucide-react'
import { useContext, useEffect, useRef, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import Dragging from './Dragging'
import MessageTextarea from './MessageTextarea'
import SendMore from './SendMore'

const isProd = import.meta.env.PROD

export default function SendMessage() {
    const { connection } = useContext(ChatsContext)
    const connectionUrl = connection.store.connectionUrl
    const socketUrl = isProd ? `${STORE_URL}/${connectionUrl}` : connectionUrl
    const [isDragging, setIsDragging] = useState<boolean>(false)

    const jid = useChatsStore((s) => s.currentChat)

    const formRef = useRef<HTMLFormElement | null>(null)
    const sendRef = useRef<HTMLButtonElement | null>(null)
    const [textMsg, setTextMsg] = useState<string>('')
    const [files, setFiles] = useState<SelectedFile[]>([])

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(textMsg, files)
    }

    const submit = async (type: 'text' | 'files') => {
        const id = toast.info('')
        try {
            if (!jid) return
            const sendBtn = sendRef.current
            if (sendBtn) sendBtn.click()

            if (type === 'text') {
                toast.loading('Enviando mensagem', { id })
                await axios.post(`${socketUrl}/messages`, {
                    type: 'text',
                    jid,
                    text: textMsg,
                })
                toast.dismiss(id)
            } else if (type === 'files' && files.length) {
                toast.loading('Enviando arquivos...', { id })

                for (let i = 0; i < files.length; i++) {
                    try {
                        const currentFile = files[i]

                        const formData = new FormData()
                        formData.append('file', currentFile.file)
                        formData.append(
                            'type',
                            currentFile.type === 'image-video'
                                ? currentFile.file.type.startsWith('video/')
                                    ? 'video'
                                    : 'image'
                                : currentFile.type
                        )
                        formData.append('jid', jid)
                        formData.append('caption', currentFile.caption || '')

                        console.log(formData)

                        toast.loading(
                            `Enviando ${i + 1} de ${files.length} (0%)`,
                            {
                                id,
                            }
                        )
                        await axios.post(`${socketUrl}/messages`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            onUploadProgress: (progressEvent) => {
                                const progress = Math.round(
                                    (progressEvent.loaded * 100) /
                                        (progressEvent.total || 1)
                                )

                                toast.loading(
                                    `Enviando ${i + 1} de ${
                                        files.length
                                    } (${progress}%)`,
                                    { id }
                                )
                            },
                        })
                    } catch (error) {
                        console.log(error)
                        toast.error('Falha ao enviar mensagem')
                    }
                }

                toast.dismiss(id)
            }

            setTextMsg('')
            setFiles([])
        } catch (error) {
            toast.error('Falha ao enviar mensagem', { id })
            console.log(error)
        }
    }

    useEffect(() => {
        document.addEventListener('dragover', (e) => {
            setIsDragging(true)
            e.preventDefault()
        })
        document.addEventListener('drop', (e) => {
            const files = e.dataTransfer?.files
            console.log('Recebeu arquivos:', !!files)
            if (files) {
                const selectedFiles = Array.from(files).map(
                    (file) =>
                        ({
                            file,
                            type: 'document',
                        } as SelectedFile)
                )
                setFiles(selectedFiles)
            }
            setIsDragging(false)
            e.preventDefault()
        })
    })

    return (
        <form
            className='flex items-center gap-2 bg-white dark:bg-input/30 rounded-3xl w-full p-1 shadow-lg relative'
            onSubmit={handleSubmit}
            ref={formRef}
        >
            {isDragging && <Dragging />}
            <SendMore
                selectedFiles={files}
                setSelectedFiles={setFiles}
                submit={() => submit('files')}
            />
            <MessageTextarea
                text={textMsg}
                setText={setTextMsg}
                submit={() => submit('text')}
            />
            <Button
                size='icon'
                className='rounded-full'
                type='submit'
                ref={sendRef}
            >
                <SendHorizontal />
            </Button>
        </form>
    )
}
