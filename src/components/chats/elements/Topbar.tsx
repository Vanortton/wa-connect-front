import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChatsContext } from '@/contexts/ChatsContext'
import { LogOut } from 'lucide-react'
import { useContext } from 'react'

export default function Topbar() {
    const { connectionStatus, connection } = useContext(ChatsContext)
    const connected = connectionStatus === 'connected'
    const statusBg = connected ? 'bg-green-500' : 'bg-red-500'
    const { attendant, store } = connection

    return (
        <header className='border-b text-xs px-4 py-1 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
                <p className='text-muted-foreground'>
                    Atendente:{' '}
                    <span className='text-black dark:text-white'>
                        {attendant?.name || 'Desconhecido'}
                    </span>
                </p>
                <p className='text-muted-foreground'>
                    Loja:{' '}
                    <span className='text-black dark:text-white'>
                        {store?.surname || 'Loja não encontrada'}
                    </span>
                </p>

                <div className='relative flex items-center'>
                    <span
                        className={`absolute inline-flex h-2 w-2 rounded-full ${statusBg} opacity-75 animate-ping`}
                    />
                    <span
                        className={`relative inline-flex h-2 w-2 rounded-full mr-2 ${statusBg}`}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Badge className='py-0 px-2 bg-black dark:bg-white dark:text-black'>
                                {connected ? 'Conectado' : 'Desconectado'}
                            </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => {}}>
                                <LogOut /> Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <p className='font-semibold text-zinc-700 dark:text-zinc-500 tracking-wide'>
                VAZAP - By Vansistem
            </p>
            <p className='font-mono text-zinc-500'>v0.1.27</p>
        </header>
    )
}
