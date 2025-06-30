import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import {
    Clock,
    Database,
    QrCode,
    RefreshCcw,
    Shield,
    Smartphone,
    Users,
    Wifi,
    Zap,
} from 'lucide-react'

export default function Features() {
    const features = [
        { icon: Wifi, description: 'Conexão em tempo real' },
        {
            icon: RefreshCcw,
            description: 'Sincronização automática de mensagens',
        },
        { icon: Users, description: 'Multiatendentes por número' },
        { icon: Database, description: 'Histórico acessível mesmo offline' },
        { icon: Zap, description: 'Interface moderna e rápida' },
        { icon: QrCode, description: 'QRCode simples para conexão' },
        { icon: Shield, description: 'Segurança de dados criptografada' },
        { icon: Clock, description: 'Atualizações automáticas' },
        {
            icon: Smartphone,
            description: 'Compatível com WhatsApp Business e comum',
        },
    ]

    return (
        <div
            className='flex flex-col lg:flex-row gap-10 px-10 py-16'
            id='features'
        >
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className='flex flex-col gap-6 w-full'
            >
                <h1 className='font-[900] text-5xl sm:text-6xl'>
                    Seu atendimento no WhatsApp
                    <br />
                    <span className='bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 bg-clip-text text-transparent'>
                        elevado ao próximo nível
                    </span>
                </h1>
                <p className='text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed'>
                    O VAZAP transforma a colaboração da sua equipe, agilizando
                    respostas, mantendo controle total sobre conversas e
                    facilitando o atendimento de ponta a ponta.
                </p>
                <Button className='p-7 text-xl w-fit rounded-full'>
                    Quero melhorar meu atendimento
                </Button>
            </motion.div>

            <motion.div
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                    hidden: {},
                    visible: {
                        transition: { staggerChildren: 0.1 },
                    },
                }}
                className='w-full'
            >
                <Card className='shadow-2xl'>
                    <CardContent className='flex flex-col gap-4'>
                        {features.map((item, index) => (
                            <motion.div
                                key={index}
                                className='flex items-center gap-3'
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.05,
                                    ease: 'easeOut',
                                }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                    }}
                                    className='w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg flex items-center justify-center'
                                >
                                    <item.icon
                                        size={24}
                                        color='white'
                                    />
                                </motion.div>
                                <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
