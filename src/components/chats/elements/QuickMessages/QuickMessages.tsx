import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import MessageForm from './MessageForm'
import SavedMessages from './SavedMessages'

export default function QuickMessage({ children }: { children: ReactNode }) {
    const [showForm, setShowForm] = useState<boolean>(false)

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className='outline-none'>
                <DialogTitle>Respostas rápidas</DialogTitle>
                {showForm ? (
                    <MessageForm setShowForm={setShowForm} />
                ) : (
                    <SavedMessages />
                )}
                <div className='flex items-center gap-2'>
                    <Button
                        onClick={() => setShowForm(true)}
                        className={cn(showForm ? 'hidden' : 'flex')}
                    >
                        <Plus /> Adicionar mensagem rápida
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
