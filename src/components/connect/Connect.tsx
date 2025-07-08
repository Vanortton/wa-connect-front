import { ChatsContext } from '@/contexts/ChatsContext'
import { useAttendant } from '@/hooks/use-attendant'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '../ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'

const connectSchema = z.object({ token: z.string() })

export default function Connect() {
    const [loading, setLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof connectSchema>>({
        resolver: zodResolver(connectSchema),
        defaultValues: { token: '' },
    })
    const { connect } = useAttendant()
    const { connectionStatus, socketRef } = useContext(ChatsContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (connectionStatus === 'connected') {
            setLoading(false)
            navigate('/conversations')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectionStatus])

    const onSubmit = async (data: z.infer<typeof connectSchema>) => {
        try {
            setLoading(true)
            const socket = await connect(data.token)
            socketRef.current = socket
        } catch (error) {
            console.error(error)
            toast.error('Falha ao conectar atendente')
        }
    }

    return (
        <div className='flex items-center justify-center h-screen'>
            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle>Conectar WhatsApp</CardTitle>
                    <CardDescription>
                        Para atender aos clientes informe a loja e o token
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-4'
                        >
                            <FormField
                                control={form.control}
                                name='token'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Token</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type='submit'
                                className='w-full'
                                disabled={loading}
                            >
                                {loading && (
                                    <Loader2Icon className='animate-spin' />
                                )}
                                Conectar
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
