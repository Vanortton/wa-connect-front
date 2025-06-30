import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { StoresContext } from '@/contexts/StoresContext'
import { UserContext } from '@/contexts/UserContext'
import { useStores } from '@/hooks/use-stores'
import type {
    Attendant as AttendantType,
    Store as StoreType,
} from '@/types/StoreTypes'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Check,
    Copy,
    Loader2Icon,
    Plus,
    Trash,
    UserPlus,
    X,
} from 'lucide-react'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const attendantSchema = z.object({
    name: z.string().nonempty('Preencha o nome'),
})

export default function Attendants({ store }: { store: StoreType }) {
    const form = useForm<z.infer<typeof attendantSchema>>({
        resolver: zodResolver(attendantSchema),
        defaultValues: { name: '' },
    })
    const [addingAttendant, setAddingAttendant] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const { createStoreAttendant } = useStores()
    const { user } = useContext(UserContext)
    const { fetchStores } = useContext(StoresContext)

    const handleAddAttendant = async ({ name }: { name: string }) => {
        try {
            if (!user || !user.token) throw 'Não autenticado'
            setLoading(true)
            await createStoreAttendant(user.token, store.id, name)
            setAddingAttendant(false)
            fetchStores(user)
        } catch (error) {
            const err = error as string
            toast.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className='flex justify-between items-center w-full'>
                <p className='text-[16px]'>
                    Atendentes ({store.attendants?.length || 0})
                </p>
                <Button onClick={() => setAddingAttendant(true)}>
                    <UserPlus /> Adicionar
                </Button>
            </div>
            {addingAttendant && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleAddAttendant)}
                        className='mb-3'
                    >
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome:</FormLabel>
                                    <FormControl>
                                        <div className='flex gap-2'>
                                            <Input {...field} />
                                            <Button
                                                size='icon'
                                                variant='secondary'
                                                onClick={() => {
                                                    form.reset()
                                                    setAddingAttendant(false)
                                                }}
                                            >
                                                <X />
                                            </Button>
                                            <Button
                                                size='icon'
                                                disabled={loading}
                                                type='submit'
                                            >
                                                {loading ? (
                                                    <Loader2Icon className='animate-spin' />
                                                ) : (
                                                    <Plus />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            )}
            {store.attendants &&
                store.attendants.map((attendant, index) => (
                    <AttendantItem
                        attendant={attendant}
                        storeId={store.id}
                        userToken={user?.token || ''}
                        onRemove={() => fetchStores(user)}
                        key={index}
                    />
                ))}
        </>
    )
}

function AttendantItem({
    attendant,
    storeId,
    userToken,
    onRemove,
}: {
    attendant: AttendantType
    storeId: string
    userToken: string
    onRemove: () => void
}) {
    const [copied, setCopied] = useState(false)
    const [removing, setRemoving] = useState(false)
    const { deleteStoreAttendant } = useStores()

    const smallBtn = {
        className: 'h-[22px] w-[22px] has-[>svg]:px-0',
        variant: 'ghost' as const,
    }

    const bgColor = attendant.online ? 'bg-green-500' : 'bg-gray-500'
    const textColor = attendant.online ? 'text-green-500' : 'text-gray-500'

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(attendant.token)
            setCopied(true)
            toast.success('Token copiado')
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.log(err)
            toast.error('Erro ao copiar token')
        }
    }

    const handleDelete = async () => {
        try {
            setRemoving(true)
            await deleteStoreAttendant(userToken, storeId, attendant.token)
            toast.success('Atendente removido')
            onRemove()
        } catch (err) {
            console.log(err)
            toast.error('Erro ao remover atendente')
        } finally {
            setRemoving(false)
        }
    }

    return (
        <Card className='py-2 w-full'>
            <CardContent className='px-3'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-3'>
                        <div
                            className={`w-[8px] h-[8px] rounded-full ${bgColor}`}
                        />
                        <div>
                            <p>{attendant.name}</p>
                            <p className={`text-sm ${textColor}`}>
                                {/* {attendant.online ? 'Online' : 'Offline'} */}
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-2 rounded-md'>
                            {attendant.token}
                            <Button
                                {...smallBtn}
                                onClick={handleCopy}
                            >
                                {copied ? (
                                    <Check size={14} />
                                ) : (
                                    <Copy size={14} />
                                )}
                            </Button>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    className='h-[22px] w-[22px] has-[>svg]:px-0 text-red-500'
                                    variant='ghost'
                                >
                                    <Trash size={10} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Remover atendente?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Isso vai excluir permanentemente esse
                                        atendente.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={removing}
                                    >
                                        {removing ? 'Removendo...' : 'Remover'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
