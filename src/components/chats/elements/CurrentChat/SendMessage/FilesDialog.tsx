import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import EaseTooltip from '@/components/ui/ease-tooltip'
import { Textarea } from '@/components/ui/textarea'
import { formatBytes } from '@/helpers/messages'
import { cn } from '@/lib/utils'
import type { SelectedFile } from '@/types/SendMessageTypes'
import { FileText, Image, Mic, SendHorizontal, Video, X } from 'lucide-react'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { PDFPreview } from './PDFPreview'

type FilesDialogParams = {
    chatName: string
    open: boolean
    selectedFiles: SelectedFile[]
    setSelectedFiles: Dispatch<SetStateAction<SelectedFile[]>>
    onSend: () => void
}

interface FilePreviewProps {
    file: File
    className?: string
    key: string | number
}

type FileIconParams = {
    file: File
    className?: string
    size?: number
    strokeWidth?: number
}

export default function FilesDialog({
    chatName,
    open,
    selectedFiles,
    setSelectedFiles,
    onSend,
}: FilesDialogParams) {
    const [activeIndex, setActiveIndex] = useState<number>(0)

    const activeFile = selectedFiles[activeIndex] ?? null

    const handleOpenChange = (open: boolean) => {
        if (!open) setSelectedFiles([])
    }

    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prev) => {
            const newArray = [...prev]
            newArray.splice(index, 1)
            return newArray
        })
        setActiveIndex((prevIndex) => {
            if (selectedFiles.length === 1) return 0
            if (index < prevIndex) return prevIndex - 1
            if (index === prevIndex) return 0
            return prevIndex
        })
    }

    useEffect(() => {
        if (selectedFiles.length === 0) {
            setActiveIndex(0)
        } else if (activeIndex >= selectedFiles.length) {
            setActiveIndex(0)
        }
    }, [selectedFiles, activeIndex])

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogContent
                aria-describedby={undefined}
                className='flex flex-col gap-4'
            >
                <DialogTitle>Enviar para {chatName}</DialogTitle>

                {activeFile && (
                    <div className='flex flex-col gap-3'>
                        <div className='border rounded-xl p-4 shadow-sm flex flex-col items-center gap-3'>
                            <p className='text-sm font-semibold'>
                                {activeFile.file.name}
                            </p>

                            <FilePreview
                                file={activeFile.file}
                                className='max-w-full max-h-50'
                                key={activeIndex}
                            />

                            <p className='text-xs text-muted-foreground'>
                                {formatBytes(activeFile.file.size)} —{' '}
                                {activeFile.file.type}
                            </p>

                            <Textarea
                                placeholder='Adicionar legenda'
                                className='w-full resize-none rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none min-h-0 max-h-[65px]'
                                rows={2}
                                value={activeFile.caption || ''}
                                onChange={(e) => {
                                    setSelectedFiles((prev) => {
                                        const newFiles = [...prev]
                                        if (newFiles[activeIndex]) {
                                            newFiles[activeIndex].caption =
                                                e.target.value
                                        }
                                        return newFiles
                                    })
                                }}
                            />
                        </div>

                        <div className='flex gap-3 items-center justify-between'>
                            <div className='flex items-center overflow-x-auto scrollbar-transparent gap-2 pt-1 pr-1'>
                                {selectedFiles.map((item, index) => (
                                    <div
                                        className='relative'
                                        key={index}
                                    >
                                        <EaseTooltip
                                            trigger={
                                                <Button
                                                    className={cn(
                                                        'w-20 h-20 rounded-md flex flex-col items-center justify-center gap-1',
                                                        index === activeIndex &&
                                                            'border-2 border-primary'
                                                    )}
                                                    variant='secondary'
                                                    onClick={() =>
                                                        setActiveIndex(index)
                                                    }
                                                >
                                                    <FileIcon
                                                        file={item.file}
                                                        className='size-8'
                                                        strokeWidth={1}
                                                    />
                                                    <span className='text-xs max-w-[60px] overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground'>
                                                        {item.file.name}
                                                    </span>
                                                </Button>
                                            }
                                            title={item.file.name}
                                        />
                                        <Button
                                            size='icon'
                                            variant='outline'
                                            className='absolute top-0 right-0 translate-x-[25%] translate-y-[-25%] size-4'
                                            onClick={() =>
                                                handleRemoveFile(index)
                                            }
                                        >
                                            <X
                                                className='size-2'
                                                strokeWidth={4}
                                            />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button
                                className='size-14 rounded-full relative'
                                onClick={onSend}
                            >
                                <Badge className='bg-foreground text-background absolute top-0 right-0 rounded-full px-[7px]'>
                                    {selectedFiles.length}
                                </Badge>
                                <SendHorizontal className='size-5' />
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

function FilePreview({ file, className, key }: FilePreviewProps) {
    const [url, setUrl] = useState<string | null>(null)

    useEffect(() => {
        const objectUrl = URL.createObjectURL(file)
        setUrl(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
    }, [file])

    if (!url) return null

    if (file.type.startsWith('image/')) {
        return (
            <img
                src={url}
                className={className}
                alt='preview'
            />
        )
    }

    if (file.type.startsWith('video/')) {
        return (
            <video
                src={url}
                className={className}
                controls
            />
        )
    }

    if (file.type === 'application/pdf') {
        return (
            <PDFPreview
                key={key}
                file={file}
                className={className}
            />
        )
    }

    return <p className={className}>Visualização não suportada</p>
}

export function FileIcon({
    file,
    className,
    size,
    strokeWidth,
}: FileIconParams) {
    const mime = file.type
    const props = { className, size, strokeWidth }

    if (mime.startsWith('image/')) return <Image {...props} />
    if (mime.startsWith('video/')) return <Video {...props} />
    if (mime.startsWith('audio/')) return <Mic {...props} />
    return <FileText {...props} />
}
