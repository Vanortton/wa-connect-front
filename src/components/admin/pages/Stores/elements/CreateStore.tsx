import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { UserContext } from '@/contexts/UserContext'
import { useStores } from '@/hooks/use-stores'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleHelp, Loader2Icon } from 'lucide-react'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type CreateStoreParams = { open: boolean; setOpen: (n: boolean) => void }
type StoreParams = { surname: string }
const storeSchema = z.object({
    surname: z.string().nonempty('Informe um apelido para a loja'),
})

export default function CreateStore({ open, setOpen }: CreateStoreParams) {
    const form = useForm<z.infer<typeof storeSchema>>({
        resolver: zodResolver(storeSchema),
        defaultValues: { surname: '' },
    })
    const [loading, setLoading] = useState<boolean>(false)
    const { user } = useContext(UserContext)
    const { createStore } = useStores()

    const handleSubmit = async ({ surname }: StoreParams) => {
        try {
            setLoading(true)
            if (!user || !user.token) throw 'Você não está autenticado'
            await createStore(user.token, surname)
            toast.success('Loja salva com sucesso, agora conecte ao WhatsApp')
        } catch (error) {
            toast.error((error as string) || 'Erro')
        } finally {
            setLoading(false)
            form.reset()
            setOpen(false)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                form.reset()
                setOpen(open)
            }}
        >
            <Form {...form}>
                <DialogContent
                    className='sm:max-w-md'
                    aria-describedby={undefined}
                >
                    <DialogHeader>
                        <DialogTitle className='text-lg font-semibold'>
                            Adicionar loja
                        </DialogTitle>
                    </DialogHeader>
                    <form
                        className='space-y-4'
                        onSubmit={form.handleSubmit(handleSubmit)}
                    >
                        <div>
                            <FormField
                                control={form.control}
                                name='surname'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Apelido:
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <CircleHelp size={14} />
                                                </TooltipTrigger>
                                                <TooltipContent side='right'>
                                                    Como você deseja chamar a
                                                    loja
                                                </TooltipContent>
                                            </Tooltip>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant='secondary'>Cancelar</Button>
                            </DialogClose>
                            <Button
                                type='submit'
                                disabled={loading}
                            >
                                {loading && (
                                    <Loader2Icon className='animate-spin' />
                                )}
                                Salvar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Form>
        </Dialog>
    )
}
