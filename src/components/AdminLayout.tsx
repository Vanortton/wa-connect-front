import Contexts from '@/contexts/Contexts'
import { Outlet } from 'react-router-dom'
import { Toaster } from './ui/sonner'

export default function AdminLayout() {
    return (
        <div className='bg-background text-foreground'>
            <Contexts>
                <Outlet />
                <Toaster />
            </Contexts>
        </div>
    )
}
