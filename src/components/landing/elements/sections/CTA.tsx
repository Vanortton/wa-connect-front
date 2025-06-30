import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function CTA() {
    return (
        <motion.div
            className='px-10 py-16 flex flex-col items-center gap-10 py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-white'
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            <motion.div
                className='bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-full px-6 py-3 border border-green-500/30 flex gap-3 items-center'
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                <Sparkles />
                Transforme seu atendimento hoje mesmo
            </motion.div>

            <motion.h1
                className='text-5xl sm:text-6xl font-[900] text-center'
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            >
                Pronto para
                <br />
                <span className='bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 bg-clip-text text-transparent'>
                    transformar o seu
                </span>
                <br />
                atendimento no WhatsApp?
            </motion.h1>

            <motion.p
                className='text-gray-300 text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto leading-relaxed text-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
            >
                Junte-se as empresas que já revolucionaram seu atendimento e
                vendas no WhatsApp
            </motion.p>

            <motion.div
                initial={{ scale: 1 }}
                whileHover={{
                    scale: 1.05,
                }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <Button className='p-7 text-2xl rounded-xl ring-offset-background shadow-3xl bg-gradient-to-r from-green-500 to-emerald-600'>
                    Comece agora mesmo
                </Button>
            </motion.div>
        </motion.div>
    )
}
