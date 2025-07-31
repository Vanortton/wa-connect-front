import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { ChatsContext } from '@/contexts/ChatsContext'
import { cn } from '@/lib/utils'
import type { FileType } from '@/types/SendMessageTypes'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

import { getLastMessageContent } from '@/helpers/chatsList'
import { useChatsStore } from '@/zustand/ChatsStore'
import { FileText, Plus, SendHorizonal, Upload, X } from 'lucide-react'

const messageSchema = z.object({ content: z.string() })

export default function SendMessageForm() {
    const { socketRef, replyMessage, quickMessages, setReplyMessage } =
        useContext(ChatsContext)
    const currentChat = useChatsStore((s) => s.currentChat)
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: { content: '' },
    })

    const [autocompleteOpen, setAutocompleteOpen] = useState(false)
    const [filteredQuickMessages, setFilteredQuickMessages] = useState<
        typeof quickMessages
    >([])
    const [highlightIndex, setHighlightIndex] = useState(0)

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Atualiza autocomplete baseado no texto depois do último '/'
    const updateAutocomplete = (text: string) => {
        const lastSlash = text.lastIndexOf('/')
        if (lastSlash === -1) {
            setAutocompleteOpen(false)
            return
        }

        // pega o texto logo após o último '/'
        const query = text.slice(lastSlash + 1).toLowerCase()

        if (query.length === 0) {
            // Mostra todas quickMessages se só tiver o '/'
            setFilteredQuickMessages(quickMessages)
            setAutocompleteOpen(true)
            setHighlightIndex(0)
            return
        }

        const filtered = quickMessages.filter((qm) =>
            qm.shortcut.toLowerCase().startsWith(query)
        )

        if (filtered.length === 0) {
            setAutocompleteOpen(false)
            return
        }

        setFilteredQuickMessages(filtered)
        setAutocompleteOpen(true)
        setHighlightIndex(0)
    }

    // controla o autocomplete conforme o usuário digita no textarea
    const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        form.setValue('content', e.target.value)
        updateAutocomplete(e.target.value)
    }

    // handle das teclas para navegar e selecionar autocomplete
    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!autocompleteOpen) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setHighlightIndex((i) => (i + 1) % filteredQuickMessages.length)
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setHighlightIndex(
                (i) =>
                    (i - 1 + filteredQuickMessages.length) %
                    filteredQuickMessages.length
            )
        } else if (e.key === 'Enter') {
            if (
                highlightIndex >= 0 &&
                highlightIndex < filteredQuickMessages.length
            ) {
                e.preventDefault()
                selectQuickMessage(filteredQuickMessages[highlightIndex])
            }
        } else if (e.key === 'Escape') {
            setAutocompleteOpen(false)
        }
    }

    // Insere a quickMessage selecionada no textarea, substituindo o texto após o último '/'
    const selectQuickMessage = (qm: (typeof quickMessages)[0]) => {
        const currentContent = form.getValues('content')
        const lastSlash = currentContent.lastIndexOf('/')
        if (lastSlash === -1) return

        const newContent = currentContent.slice(0, lastSlash) + qm.text + ' '
        form.setValue('content', newContent)
        setAutocompleteOpen(false)
        // coloca o foco e move cursor pra o final
        setTimeout(() => {
            textareaRef.current?.focus()
            textareaRef.current?.setSelectionRange(
                newContent.length,
                newContent.length
            )
        }, 0)
    }

    const handleSendMessage = ({
        type,
        content,
    }: {
        type: 'text' | 'file'
        content: string | FileType
    }) => {
        if (!socketRef.current) {
            toast.error('A mensagem não foi enviada')
            return
        }
        if (type === 'text')
            socketRef.current.emit('send-message', {
                jid: currentChat,
                type,
                content,
                reply: replyMessage?.key.id,
            })
        else if (type === 'file') {
            socketRef.current.emit('send-message', {
                jid: currentChat,
                type,
                content,
                reply: replyMessage?.key.id,
            })
        }
        setReplyMessage(null)
        form.reset()
        setAutocompleteOpen(false)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(({ content }) => {
                    handleSendMessage({
                        type: 'text',
                        content,
                    })
                })}
                autoComplete='off'
                className='relative'
            >
                <FormField
                    name='content'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem
                            aria-label='Mensagem'
                            className='w-full'
                        >
                            <FormControl>
                                <div className='space-y-2 relative'>
                                    <ReplyMessage />
                                    <div className='relative'>
                                        <SendFile
                                            onSendFile={(fileContent) =>
                                                handleSendMessage({
                                                    type: 'file',
                                                    content: fileContent,
                                                })
                                            }
                                        />
                                        <Textarea
                                            {...field}
                                            placeholder='Digite uma mensagem'
                                            className='resize-none rounded-3xl min-h-[48px] max-h-[150px] pr-12 pl-4 py-3 text-lg bg-background border-0 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-12 scrollbar-transparent'
                                            rows={0}
                                            ref={textareaRef}
                                            onChange={onContentChange}
                                            onKeyDown={onKeyDown}
                                        />
                                        <Button
                                            size='icon'
                                            className='rounded-full p-2 absolute top-[50%] right-1 translate-y-[-50%]'
                                        >
                                            <SendHorizonal />
                                        </Button>

                                        {autocompleteOpen && (
                                            <ul className='absolute z-50 bg-background border border-muted rounded-md shadow-md max-h-40 overflow-auto w-full mb-1 left-0 bottom-full px-2 py-1'>
                                                {filteredQuickMessages.map(
                                                    (qm, i) => (
                                                        <li
                                                            key={qm.shortcut}
                                                            className={cn(
                                                                'cursor-pointer p-1 rounded',
                                                                i ===
                                                                    highlightIndex
                                                                    ? 'bg-muted'
                                                                    : ''
                                                            )}
                                                            onMouseDown={(
                                                                e
                                                            ) => {
                                                                e.preventDefault()
                                                                selectQuickMessage(
                                                                    qm
                                                                )
                                                            }}
                                                        >
                                                            <b>
                                                                /{qm.shortcut}
                                                            </b>
                                                            : {qm.text}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

function ReplyMessage() {
    const { replyMessage, setReplyMessage } = useContext(ChatsContext)

    if (!replyMessage) return null
    return (
        <Card className='border-0 p-0 border-s-4 border-emerald-500 mx-1 rounded-md'>
            <CardContent className='px-4 py-2 flex justify-between items-center'>
                <div>
                    <div className='text-xs text-muted-foreground'>
                        {replyMessage.pushName}
                    </div>
                    <div>{getLastMessageContent(replyMessage)}</div>
                </div>
                <Button
                    className='rounded-full h-auto p-0 has-[>svg]:px-0 size-5'
                    variant='ghost'
                    type='button'
                    onClick={() => setReplyMessage(null)}
                >
                    <X
                        className='size-3'
                        strokeWidth={3}
                    />
                </Button>
            </CardContent>
        </Card>
    )
}

function SendFile({ onSendFile }: { onSendFile: (file: FileType) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    const items = [{ icon: FileText, color: 'purple', label: 'Documento' }]

    const handleFileClick = (label: string) => {
        if (label === 'Documento') fileInputRef.current?.click()
    }

    const processFile = (file: File) => {
        const reader = new FileReader()
        reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1]
            console.log(base64, file.name, file.type)
            onSendFile({
                document: base64,
                fileName: file.name,
                mimeType: file.type,
            })
        }
        reader.readAsDataURL(file)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) processFile(file)
        e.target.value = ''
    }

    useEffect(() => {
        document.addEventListener('dragover', (e) => {
            setIsDragging(true)
            e.preventDefault()
        })
        document.addEventListener('drop', (e) => {
            if (fileInputRef.current && e.dataTransfer?.files) {
                fileInputRef.current.files = e.dataTransfer.files
                console.log(e.dataTransfer.files[0])
                processFile(e.dataTransfer.files[0])
            }
            setIsDragging(false)
            e.preventDefault()
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <input
                type='file'
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            <div className='absolute top-[50%] left-1 translate-y-[-50%]'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size='icon'
                            className={cn(
                                'rounded-full p-2 transition-all',
                                isDragging ? 'shadow-md shadow-emerald-500' : ''
                            )}
                        >
                            <Plus />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className='shadow-xl border-0 p-2'
                        sideOffset={15}
                    >
                        {items.map((item) => (
                            <DropdownMenuItem
                                key={item.label}
                                className='text-md'
                                onClick={() => handleFileClick(item.label)}
                            >
                                <item.icon
                                    className={cn(
                                        'size-[18px]',
                                        `text-${item.color}-600`
                                    )}
                                />
                                {item.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {isDragging && (
                <div className='absolute inset-0 flex items-center justify-center w-full bg-muted shadow-md h-16 top-[-150%] rounded-lg flex gap-2 shadow-md'>
                    <Upload />
                    Solte o arquivo aqui
                </div>
            )}
        </>
    )
}
