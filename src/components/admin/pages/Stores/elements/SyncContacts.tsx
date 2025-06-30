import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Users } from 'lucide-react'

type SyncContactsParams = {
    store: string
}

export default function SyncContacts({ store }: SyncContactsParams) {
    console.log(store)

    return (
        <Tooltip>
            <TooltipTrigger>
                <Button
                    variant='outline'
                    disabled={true}
                >
                    <Users /> Sincronizar contatos
                </Button>
            </TooltipTrigger>
            <TooltipContent>Em breve</TooltipContent>
        </Tooltip>
    )
}
