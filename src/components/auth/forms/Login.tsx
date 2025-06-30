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
import { InputPassword } from '@/components/ui/input-password'
import { useAuth } from '@/hooks/use-auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'

type LoginParams = {
    email: string
    password: string
}

const loginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve conter pelo menos 6 caracteres'),
})

export default function Login() {
    const [loading, setLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleSubmit = async ({ email, password }: LoginParams) => {
        try {
            setLoading(true)
            const user = await login({ email, password })
            if (user) {
                toast.success('Usuário conectado com sucesso')
                navigate('/admin')
            }
        } catch (error) {
            console.log(error)
            toast.error('Erro no login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className='text-center mb-4'>
                <h1 className='text-xl font-bold'>Bem vindo de volta</h1>
                <p>Entre com seu email e senha</p>
            </div>
            <Form {...form}>
                <form
                    className='space-y-4'
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail:</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type='email'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <div className='flex items-center justify-between'>
                                    <FormLabel htmlFor='password'>
                                        Senha:
                                    </FormLabel>
                                    <a
                                        href='#'
                                        className='ml-auto text-sm underline-offset-4 hover:underline'
                                    >
                                        Esqueceu a senha?
                                    </a>
                                </div>
                                <FormControl>
                                    <InputPassword {...field} />
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
                        {loading && <Loader2Icon className='animate-spin' />}
                        Entrar
                    </Button>
                    <div className='text-center text-sm'>
                        Não tem uma conta?{' '}
                        <Link
                            to='signin'
                            className='underline underline-offset-4'
                        >
                            Crie uma
                        </Link>
                    </div>
                </form>
            </Form>
        </>
    )
}
