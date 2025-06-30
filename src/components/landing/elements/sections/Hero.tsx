import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { InfinityIcon } from 'lucide-react'

export default function Hero() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className='relative overflow-hidden flex flex-col items-center justify-center min-h-screen gap-6 px-5 py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'
        >
            {/* EFEITOS DE BACKGROUND */}
            <motion.div
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, 30, -30, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 20,
                    ease: 'easeInOut',
                }}
                className='absolute -top-20 -left-20 w-[400px] h-[400px] bg-green-500/20 rounded-full blur-3xl opacity-70'
            />
            <motion.div
                animate={{
                    x: [0, -40, 40, 0],
                    y: [0, -20, 20, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 25,
                    ease: 'easeInOut',
                }}
                className='absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-3xl opacity-60'
            />
            <motion.div
                animate={{
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 8,
                    ease: 'easeInOut',
                }}
                className='absolute inset-0 bg-gradient-to-tr from-green-500/5 via-emerald-500/5 to-transparent opacity-30 blur-2xl pointer-events-none'
            />

            {/* CONTEÚDO */}
            <h1 className='text-center text-5xl md:text-6xl font-[900] z-10'>
                Tenha{' '}
                <motion.span
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    className='inline-flex'
                >
                    <InfinityIcon
                        className='text-green-500 animate-pulse translate-y-[15px]'
                        strokeWidth={3}
                        size={75}
                    />
                </motion.span>{' '}
                dispositivos
                <br />
                <span className='bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 bg-clip-text text-transparent'>
                    conectados ao mesmo
                </span>
                <br />
                número de WhatsApp
            </h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className='max-w-xl text-gray-600 dark:text-gray-300 text-xl text-center font-medium leading-relaxed z-10'
            >
                Conecte sua equipe ao mesmo número com mensagens sincronizadas,
                atendimento rápido e sem complicações.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className='z-10'
            >
                <Button className='py-3 px-5 md:px-7 text-lg md:text-xl rounded-full whitespace-normal h-auto'>
                    Comece agora{' '}
                    <span className='block sm:hidden'>mesmo 🚀</span>
                    <span className='hidden sm:block'>
                        e transforme seu atendimento
                    </span>
                </Button>
            </motion.div>
        </motion.div>
    )
}
