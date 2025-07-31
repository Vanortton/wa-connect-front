import { Ban } from 'lucide-react'

export default function DeletedMessage() {
    return (
        <p className='italic text-muted-foreground flex items-center gap-2'>
            <Ban size={16} /> Mensagem apagada
        </p>
    )
}
