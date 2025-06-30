import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'

// TODO: Adicionar flexibilidade de personalização do botão
export function ToggleTheme() {
    const { theme, setTheme } = useTheme()

    const newTheme = () => {
        switch (theme) {
            case 'light':
                return 'dark'
            case 'dark':
                return 'light'
            default:
                return 'dark'
        }
    }

    const toggleTheme = () => {
        setTheme(newTheme())
    }

    return (
        <Button
            variant='ghost'
            size='icon'
            onClick={toggleTheme}
        >
            {theme === 'dark' && <Moon />}
            {theme === 'light' && <Sun />}
        </Button>
    )
}
