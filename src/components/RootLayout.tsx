import { ThemeProvider } from '@/contexts/ThemeContext'
import { Outlet } from 'react-router-dom'
import { Toaster } from './ui/sonner'

export default function RootLayout() {
    return (
        <div className='bg-background text-foreground'>
            <ThemeProvider>
                <Outlet />
                <Toaster />
            </ThemeProvider>
        </div>
    )
}
