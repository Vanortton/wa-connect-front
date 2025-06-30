import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Mail, Phone } from 'lucide-react'
import Vazap from '../../../assets/vazap.webp'

export default function Footer() {
    const links = [
        { link: '#solutions', text: 'Soluções' },
        { link: '#features', text: 'Recursos' },
        { link: '#faq', text: 'FAQ' },
        { link: '#pricing', text: 'Preço' },
    ]

    return (
        <motion.footer
            className='border-t px-10 py-16'
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
            <div className='flex flex-col md:flex-row justify-between gap-8 mb-8'>
                <div>
                    <div className='flex items-center gap-2 mb-3'>
                        <img
                            src={Vazap}
                            alt='Logo'
                            width={50}
                        />
                        <p className='text-2xl font-bold'>VAZAP</p>
                    </div>
                    <p className='text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-md'>
                        A plataforma que revoluciona o atendimento no WhatsApp,
                        conectando equipes inteiras ao mesmo número com
                        sincronização em tempo real.
                    </p>
                </div>
                <div>
                    <h1 className='text-gray-900 dark:text-white font-bold text-lg mb-2'>
                        Navegação
                    </h1>
                    {links.map((navLink, index) => (
                        <p
                            className='text-gray-600 dark:text-gray-300 font-medium mb-2'
                            key={index}
                        >
                            <a
                                href={navLink.link}
                                className='hover:text-green-500 dark:hover:text-emerald-400 transition-colors duration-300'
                            >
                                {navLink.text}
                            </a>
                        </p>
                    ))}
                </div>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-gray-900 dark:text-white font-bold text-lg mb-1'>
                        Contato
                    </h1>
                    <div className='flex items-center gap-2'>
                        <Button
                            size='icon'
                            variant='outline'
                        >
                            <Mail />
                        </Button>
                        <a
                            href='mailto:vanortton@gmail.com'
                            className='hover:text-green-500 dark:hover:text-emerald-400 transition-colors duration-300'
                        >
                            vanortton@gmail.com
                        </a>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button
                            size='icon'
                            variant='outline'
                        >
                            <Phone />
                        </Button>
                        <a
                            href='https://wa.me/5575991034695'
                            className='hover:text-green-500 dark:hover:text-emerald-400 transition-colors duration-300'
                        >
                            (75) 99103-4695
                        </a>
                    </div>
                </div>
            </div>
            <div className='pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 dark:text-gray-400 text-sm'>
                <p>
                    © {new Date().getFullYear()} VANSISTEM - Todos os direitos
                    reservados.
                </p>
                <div className='flex gap-5'>
                    <a
                        href='#'
                        className='hover:text-green-500 dark:hover:text-emerald-400 transition-colors duration-300'
                    >
                        Política de privacidade
                    </a>
                    <a
                        href='#'
                        className='hover:text-green-500 dark:hover:text-emerald-400 transition-colors duration-300'
                    >
                        Termos de uso
                    </a>
                </div>
            </div>
        </motion.footer>
    )
}
