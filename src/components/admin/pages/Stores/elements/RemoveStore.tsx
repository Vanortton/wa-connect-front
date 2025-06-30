import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { StoresContext } from '@/contexts/StoresContext'
import { UserContext } from '@/contexts/UserContext'
import { useStores } from '@/hooks/use-stores'
import { Loader2Icon } from 'lucide-react'
import { useContext, useState } from 'react'
import { toast } from 'sonner'

type RemoveStoreParams = {
    open: boolean
    setOpen: (n: boolean) => void
    storeId: string
}

export default function RemoveStore({
    open,
    setOpen,
    storeId,
}: RemoveStoreParams) {
    const [loading, setLoading] = useState<boolean>(false)
    const { deleteStore } = useStores()
    const { user } = useContext(UserContext)
    const { fetchStores } = useContext(StoresContext)

    const handleDeleteStore = async () => {
        try {
            setLoading(true)
            if (!user || !user.token) throw 'Você não está autenticado'
            await deleteStore(user.token, storeId)
        } catch (error) {
            console.log(error)
            toast.error((error as string) || 'Erro')
        } finally {
            setOpen(false)
            setLoading(false)
            fetchStores(user)
        }
    }

    return (
        <AlertDialog
            open={open}
            onOpenChange={setOpen}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Tem certeza que deseja excluir a loja?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Essa ação é irreversível. Isso irá deletar
                        permanentemente a loja da e excluir as credenciais de
                        conexão ao WhatsApp.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        Cancelar
                    </AlertDialogCancel>
                    <Button
                        className='bg-red-500 text-white hover:bg-red-600'
                        onClick={handleDeleteStore}
                        disabled={loading}
                    >
                        {loading && <Loader2Icon className='animate-spin' />}
                        Excluir
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
