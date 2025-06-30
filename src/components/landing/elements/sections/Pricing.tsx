import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { CircleCheck } from 'lucide-react'

export default function Pricing() {
    const features = [
        'Conexões simultâneas ilimitadas com o mesmo número',
        'Funciona com números WhatsApp normal e Business',
        'Sincronização de mensagens mesmo offline',
        'Histórico completo para todos os atendentes',
        'Conexão rápida via QR Code',
        'Interface otimizada e responsiva',
        'Suporte prioritário via chat e WhatsApp',
        'Compatível com desktop e mobile',
        'Segurança de dados criptografada',
        'Atualizações frequentes incluídas',
        'Suporte para múltiplas lojas',
        'Backup automático das conversas',
        'Relatórios de atendimento detalhados',
        'Integração com ferramentas existentes',
    ]

    return (
        <div
            className='px-10 py-16'
            id='pricing'
        >
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className='text-5xl sm:text-6xl font-[900] text-center mb-10'
            >
                Plano único
                <br />
                <span className='bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 bg-clip-text text-transparent'>
                    simples e completo
                </span>
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <Card className='max-w-[700px] mx-auto shadow-2xl'>
                    <CardContent className='flex flex-col gap-6'>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className='text-center'
                        >
                            <span className='text-5xl sm:text-6xl font-[900]'>
                                R$180
                            </span>
                            <span className='text-2xl text-gray-600 dark:text-gray-400 font-bold'>
                                /mês por loja
                            </span>
                        </motion.h2>

                        <motion.div
                            initial='hidden'
                            whileInView='visible'
                            viewport={{ once: true, amount: 0.3 }}
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: {
                                        staggerChildren: 0.05,
                                    },
                                },
                            }}
                            className='grid grid-flow-row grid-cols-2 gap-4'
                        >
                            {features.map((item, index) => (
                                <motion.p
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.03,
                                    }}
                                    className='text-gray-800 dark:text-gray-200 font-medium leading-relaxed flex items-center gap-2'
                                >
                                    <span>
                                        <CircleCheck className='flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-1 text-white' />
                                    </span>{' '}
                                    {item}
                                </motion.p>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                        >
                            <Button className='p-7 text-xl rounded-xl w-full transition-transform hover:scale-[1.02]'>
                                Quero começar agora
                            </Button>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
