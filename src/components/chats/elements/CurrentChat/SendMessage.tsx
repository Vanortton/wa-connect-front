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
import { Input } from '@/components/ui/input'
import { ChatsContext } from '@/contexts/ChatsContext'
import { getBasicMessageContent } from '@/helpers/messages'
import { cn } from '@/lib/utils'
import type { FileType } from '@/types/SendMessageTypes'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    FileText,
    Headphones,
    Images,
    Plus,
    SendHorizonal,
    X,
} from 'lucide-react'
import { useContext, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const messageSchema = z.object({ content: z.string() })

export default function SendMessageForm() {
    const { socketRef, currentChat, replyMessage, setReplyMessage } =
        useContext(ChatsContext)
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: { content: '' },
    })

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
                reply: replyMessage?.id,
            })
        else if (type === 'file') {
            socketRef.current.emit('send-message', {
                jid: currentChat,
                type,
                content,
                reply: replyMessage?.id,
            })
        }
        setReplyMessage(null)
        form.reset()
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
                                <div className='space-y-2'>
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
                                        <Input
                                            placeholder='Digite uma mensagem'
                                            {...field}
                                            className='rounded-full h-auto border-0 py-3 px-12 text-lg bg-background shadow-sm'
                                        />
                                        <Button
                                            size='icon'
                                            className='rounded-full p-2 absolute top-[50%] right-1 translate-y-[-50%]'
                                        >
                                            <SendHorizonal />
                                        </Button>
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

    if (!replyMessage) return
    return (
        <Card className='border-0 p-0 border-s-4 border-emerald-500 mx-1 rounded-md'>
            <CardContent className='px-4 py-2 flex justify-between items-center'>
                <div>
                    <div className='text-xs text-muted-foreground'>
                        {replyMessage.sender.pushName}
                    </div>
                    <div>{getBasicMessageContent(replyMessage.content)}</div>
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

    const items = [
        { icon: FileText, color: 'purple', label: 'Documento' },
        {
            icon: Images,
            color: 'blue',
            label: 'Fotos e vídeos',
            disabled: true,
        },
        { icon: Headphones, color: 'orange', label: 'Audio', disabled: true },
    ]

    const handleFileClick = (label: string) => {
        if (label === 'Documento') fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0]
            if (!file) return

            const reader = new FileReader()
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1]

                onSendFile({
                    document: base64,
                    fileName: file.name,
                    mimeType: file.type,
                })
            }
            reader.readAsDataURL(file)
            e.target.value = ''
        } catch (err) {
            console.error(err)
            toast.error('Erro ao processar arquivo')
        }
    }

    return (
        <>
            <input
                type='file'
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size='icon'
                        className='rounded-full p-2 absolute top-[50%] left-1 translate-y-[-50%]'
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
                            disabled={item.disabled}
                        >
                            <item.icon
                                className={cn(
                                    'size-[18px]',
                                    `text-${item.color}-600`
                                )}
                            />{' '}
                            {item.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
