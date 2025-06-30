import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
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

type SigninParams = {
    name: string
    email: string
    password: string
    confirmPassword: string
}

const passwordMessage = 'A senha deve conter pelo menos 6 caracteres'

const signinSchema = z.object({
    name: z.string().min(3, 'O nome deve conter pelo menos 3 letras'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, passwordMessage),
    confirmPassword: z.string().min(6, passwordMessage),
})

export default function Signin() {
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })
    const { signin } = useAuth()

    const handleSubmit = async ({
        name,
        email,
        password,
        confirmPassword,
    }: SigninParams) => {
        try {
            setLoading(true)
            if (confirmPassword !== password) {
                toast.error('As senhas não conferem')
                return
            }
            const user = await signin({ name, email, password })
            if (user) {
                toast.success('Conta criada com sucesso')
                navigate('/admin')
            }
        } catch (error) {
            console.log(error)
            toast.error('Erro criando conta')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className='text-center mb-4'>
                <h1 className='text-xl font-bold'>Bem vindo</h1>
                <p>Crie sua conta com e-mail e senha</p>
            </div>
            <Form {...form}>
                <form
                    className='space-y-4'
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome:</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail:</FormLabel>
                                <FormControl>
                                    <Input {...field} />
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
                                <FormLabel>Senha:</FormLabel>
                                <FormControl>
                                    <InputPassword {...field} />
                                </FormControl>
                                <FormDescription className='text-xs'>
                                    A senha precisa ter mais de 6 caracteres e
                                    conter ao menos 1 letra, 1 número e 1
                                    caractere especial
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='confirmPassword'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirme a Senha:</FormLabel>
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
                        Criar conta
                    </Button>
                    <div className='text-center text-sm'>
                        Já tem uma conta?{' '}
                        <Link
                            to='/auth'
                            className='underline underline-offset-4'
                        >
                            Login
                        </Link>
                    </div>
                </form>
            </Form>
        </>
    )
}
