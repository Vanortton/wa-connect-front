import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Sidebar as SidebarContainer,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ToggleTheme } from '@/components/ui/toggle-theme'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { UserContext } from '@/contexts/UserContext'
import { auth } from '@/firebase'
import { signOut } from 'firebase/auth'
import {
    ChevronUp,
    CircleUserRound,
    Home,
    LogOut,
    Settings,
    Store,
    User,
    Users,
    Wallet,
    type LucideProps,
} from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import Vazap from '../../../assets/vazap.webp'

type SidebarNavItem = {
    title: string
    url: string
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'>>
    disabled?: boolean
}

const items: SidebarNavItem[] = [
    {
        title: 'Painel',
        url: '#',
        icon: Home,
        disabled: true,
    },
    {
        title: 'Lojas',
        url: '/admin/stores',
        icon: Store,
    },
    {
        title: 'Atendentes',
        url: '#',
        icon: Users,
        disabled: true,
    },
    {
        title: 'Configurações',
        url: '#',
        icon: Settings,
        disabled: true,
    },
]

type UserDataType = {
    name: string
    email: string
}

function Header() {
    return (
        <SidebarHeader>
            <div className='flex items-center justify-between px-3 py-0 pt-3'>
                <div className='flex items-center gap-2'>
                    <img
                        src={Vazap}
                        alt='Logo'
                        width={45}
                        style={{ marginBottom: '-5px' }}
                    />
                    <p className='text-2xl font-bold'>VAZAP</p>
                </div>
                <ToggleTheme />
            </div>
        </SidebarHeader>
    )
}

function Nav({ items }: { items: SidebarNavItem[] }) {
    return (
        <SidebarContent className='px-3'>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                {item.disabled ? (
                                    <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className='flex items-center gap-2 text-muted-foreground opacity-50 cursor-not-allowed px-3 py-2 rounded-md w-full'>
                                                    <item.icon size={18} />
                                                    <span>{item.title}</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side='right'>
                                                <span>Em breve</span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : (
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    )
}

function Footer() {
    const [userData, setUserData] = useState<UserDataType>({} as UserDataType)
    const { user } = useContext(UserContext)

    useEffect(() => {
        if (user) {
            const name =
                user.status === 'loading'
                    ? 'Carregando...'
                    : user.displayName || 'Desconhecido'

            const email =
                user.status === 'loading'
                    ? 'carregando...'
                    : user.email || 'email@ex.com'

            setUserData({ name, email })
        } else setUserData({ name: 'Desconectado', email: 'email@ex.com' })
    }, [user])

    return (
        <SidebarFooter className='px-3'>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton className='py-1 h-auto rounded-md'>
                                <CircleUserRound className='!h-6 !w-6' />
                                <div>
                                    <p>{userData.name}</p>
                                    <p className='text-xs'>{userData.email}</p>
                                </div>
                                <ChevronUp className='ml-auto' />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side='top'>
                            <DropdownMenuItem>
                                <div className='flex gap-2 items-center justify-start'>
                                    <User /> Conta
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <div className='flex gap-2 items-center justify-start'>
                                    <Wallet /> Pagamentos
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                variant='destructive'
                                onClick={() => signOut(auth)}
                            >
                                <div className='flex gap-2 items-center justify-start'>
                                    <LogOut className='text-red-400' /> Sair
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    )
}

export default function Sidebar() {
    return (
        <SidebarContainer>
            <Header />
            <Nav items={items} />
            <Footer />
        </SidebarContainer>
    )
}
