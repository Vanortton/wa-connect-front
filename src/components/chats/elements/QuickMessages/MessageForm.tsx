import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useQuickMsgs } from '@/hooks/use-quick-msgs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type MessageFormParams = {
    setShowForm: (v: boolean) => void
}

const quickMessageSchema = z.object({
    shortcut: z.string().min(1, 'Informe o atalho'),
    text: z.string().min(1, 'Informe o texto'),
})

export default function MessageForm({ setShowForm }: MessageFormParams) {
    const form = useForm<z.infer<typeof quickMessageSchema>>({
        resolver: zodResolver(quickMessageSchema),
        defaultValues: {
            shortcut: '',
            text: '',
        },
    })

    const { addQuickMsg } = useQuickMsgs()
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data: z.infer<typeof quickMessageSchema>) => {
        setLoading(true)
        try {
            await addQuickMsg(data)
            toast.success('Mensagem rápida salva!')
            form.reset()
            setShowForm(false)
        } catch (err) {
            toast.error('Erro ao salvar mensagem rápida')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-3'
                autoComplete='off'
            >
                <FormField
                    name='shortcut'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Atalho</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={loading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name='text'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Texto</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    disabled={loading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='space-x-2'>
                    <Button
                        type='submit'
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button
                        variant='secondary'
                        onClick={() => {
                            setShowForm(false)
                            form.reset()
                        }}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </Form>
    )
}
