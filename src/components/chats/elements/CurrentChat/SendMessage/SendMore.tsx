import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useChats } from '@/hooks/use-chats'
import type { FilesTypes, SelectedFile } from '@/types/SendMessageTypes'
import { useChatsStore } from '@/zustand/ChatsStore'
import { FileText, Headphones, Images, Plus } from 'lucide-react'
import React, {
    useEffect,
    useState,
    type Dispatch,
    type SetStateAction,
} from 'react'
import FilesDialog from './FilesDialog'

type SendMoreParams = {
    selectedFiles: SelectedFile[]
    setSelectedFiles: Dispatch<SetStateAction<SelectedFile[]>>
    submit: () => void
}

export default function SendMore({
    selectedFiles,
    setSelectedFiles,
    submit,
}: SendMoreParams) {
    const [open, setOpen] = useState<boolean>(false)
    const { getFallbackName } = useChats()
    const chat = useChatsStore((s) =>
        s.currentChat ? s.chats[s.currentChat] : null
    )
    const chatName = chat?.name || getFallbackName(chat?.id || '')

    const selectFiles = (type: FilesTypes, allowedExt: string[]) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.multiple = true
        input.max = '5'
        input.accept = allowedExt.join(',')
        input.click()
        input.onchange = () => {
            const files = input.files
            if (!files?.length) return

            const selectedFiles = Array.from(files).map((file) => ({
                file,
                type,
            }))
            setSelectedFiles(selectedFiles)
            setOpen(true)
        }
    }

    const options = [
        {
            icon: FileText,
            label: 'Documento',
            onClick: () => selectFiles('document', ['*']),
        },
        {
            icon: Images,
            label: 'Fotos e vídeos',
            onClick: () => selectFiles('image-video', ['image/*', 'video/*']),
        },
        {
            icon: Headphones,
            label: 'Áudio',
            onClick: () => selectFiles('audio', ['audio/*']),
        },
    ]

    useEffect(() => {
        if (!selectedFiles.length) setOpen(false)
        else setOpen(true)
    }, [selectedFiles])

    return (
        <React.Fragment>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size='icon'
                        variant='ghost'
                        type='button'
                        className='rounded-full'
                    >
                        <Plus />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='border-gray-500/10'>
                    {options.map((item, index) => (
                        <DropdownMenuItem
                            onClick={item.onClick}
                            key={index}
                        >
                            <item.icon /> {item.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <FilesDialog
                chatName={chatName}
                open={open}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                onSend={() => {
                    submit()
                    setOpen(false)
                }}
            />
        </React.Fragment>
    )
}
