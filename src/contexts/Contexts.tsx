import type { ReactNode } from 'react'
import { StoresProvider } from './StoresContext'
import { ThemeProvider } from './ThemeContext'
import { UserProvider } from './UserContext'

export default function Contexts({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <UserProvider>
                <StoresProvider>{children}</StoresProvider>
            </UserProvider>
        </ThemeProvider>
    )
}
