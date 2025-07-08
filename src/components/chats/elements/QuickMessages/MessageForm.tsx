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
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type MessageFormParams = {
    setShowForm: (v: boolean) => void
}

const quickMessageSchema = z.object({
    shortcut: z.string(),
    text: z.string(),
})

export default function MessageForm({ setShowForm }: MessageFormParams) {
    const form = useForm<z.infer<typeof quickMessageSchema>>({
        resolver: zodResolver(quickMessageSchema),
        defaultValues: {
            shortcut: '',
            text: '',
        },
    })

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(() => {})}
                className='space-y-3'
                autoComplete='off'
            >
                <FormField
                    name='shortcut'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Atalho</FormLabel>
                            <FormControl>
                                <Input {...field} />
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
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='space-x-2'>
                    <Button
                        onClick={() => {
                            setShowForm(false)
                            form.reset()
                        }}
                    >
                        Salvar
                    </Button>
                    <Button
                        variant='secondary'
                        onClick={() => {
                            setShowForm(false)
                            form.reset()
                        }}
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </Form>
    )
}
