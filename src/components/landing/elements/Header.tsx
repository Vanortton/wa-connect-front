import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ToggleTheme } from '@/components/ui/toggle-theme'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import Vazap from '../../../assets/vazap.webp'

export default function Header() {
    const links = [
        { link: '#solutions', text: 'Soluções' },
        { link: '#features', text: 'Recursos' },
        { link: '#faq', text: 'FAQ' },
        { link: '#pricing', text: 'Preço' },
    ]

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className='fixed top-0 w-full border-b backdrop-blur-lg z-50 bg-background/70 dark:bg-background/50'>
            <div className='flex items-center justify-between py-4 px-6 md:px-10'>
                <div className='flex items-center gap-2'>
                    <img
                        src={Vazap}
                        alt='Logo'
                        width={40}
                    />
                    <div className='flex flex-col'>
                        <p className='text-xl font-bold md:text-2xl'>VAZAP</p>
                        <span className='text-xs'>EMPRESARIAL</span>
                    </div>
                </div>

                <nav className='hidden md:flex gap-10'>
                    {links.map(({ link, text }) => (
                        <a
                            key={text}
                            className='relative text-base text-gray-600 dark:text-gray-300 font-medium after:content-[""] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-emerald-500 after:transition-all after:duration-300 hover:after:w-full cursor-pointer'
                            onClick={() => {
                                document.querySelector(link)?.scrollIntoView()
                            }}
                        >
                            {text}
                        </a>
                    ))}
                </nav>

                <div className='flex items-center gap-2 md:hidden'>
                    <ToggleTheme />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant='outline'
                                size='icon'
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                                aria-label='Menu'
                            >
                                {mobileMenuOpen ? (
                                    <X size={24} />
                                ) : (
                                    <Menu size={24} />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align='end'
                            className='w-40'
                        >
                            {links.map(({ link, text }) => (
                                <DropdownMenuItem
                                    key={text}
                                    asChild
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <a href={link}>{text}</a>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuItem
                                asChild
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Link to='/auth'>
                                    <Button className='w-full mt-2 bg-linear-45 from-green-500 to-emerald-600'>
                                        Login
                                    </Button>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                asChild
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Link to='/connect'>
                                    <Button className='w-full'>Conectar</Button>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className='hidden md:flex items-center gap-2'>
                    <ToggleTheme />
                    <Link to='/auth'>
                        <Button className='bg-linear-45 from-green-500 to-emerald-600'>
                            Login
                        </Button>
                    </Link>
                    <Link to='/connect'>
                        <Button>Conectar</Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
