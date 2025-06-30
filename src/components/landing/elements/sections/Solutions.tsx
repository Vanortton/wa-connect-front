import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import {
    Clock,
    MessageCircle,
    Shield,
    Store,
    Users,
    Zap,
    type LucideProps,
} from 'lucide-react'

type CardItem = {
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'>>
    title: string
    description: string
    gradient: string
}

function SolutionCard({ card, index }: { card: CardItem; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
                delay: index * 0.1,
                duration: 0.6,
                ease: 'easeOut',
            }}
            whileHover={{ scale: 1.03 }}
            className='transition-transform duration-300'
        >
            <Card className='rounded-3xl shadow-lg'>
                <CardContent className='flex flex-col gap-3'>
                    <motion.div
                        whileHover={{ rotate: 10 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${card.gradient} p-4 shadow-2xl flex items-center justify-center`}
                    >
                        <card.icon
                            size={30}
                            color='white'
                        />
                    </motion.div>
                    <h3 className='font-bold text-xl'>{card.title}</h3>
                    <p>{card.description}</p>
                </CardContent>
            </Card>
        </motion.div>
    )
}

const cards: CardItem[] = [
    {
        icon: Users,
        title: 'Atendimento em equipe',
        description:
            'Múltiplos atendentes no mesmo número sem precisar compartilhar o celular',
        gradient: 'from-blue-500 to-blue-600',
    },
    {
        icon: MessageCircle,
        title: 'Histórico sincronizado',
        description:
            'Conversas sincronizadas em tempo real com todos os membros da equipe',
        gradient: 'from-green-500 to-emerald-600',
    },
    {
        icon: Store,
        title: 'Múltiplas lojas',
        description: 'Integração leve e rápida para gerenciar várias unidades',
        gradient: 'from-purple-500 to-purple-600',
    },
    {
        icon: Zap,
        title: 'Interface moderna',
        description:
            'Experiência rápida e intuitiva construída com tecnologia de ponta',
        gradient: 'from-orange-500 to-red-500',
    },
    {
        icon: Shield,
        title: 'Segurança total',
        description: 'Dados protegidos com criptografia de ponta-a-ponta',
        gradient: 'from-indigo-500 to-indigo-600',
    },
    {
        icon: Clock,
        title: 'Disponível 24/7',
        description:
            'Sistema confiável que funciona sempre que você precisa usar ',
        gradient: 'from-teal-500 to-cyan-600',
    },
]

export default function Solutions() {
    return (
        <div
            className='px-10 py-16'
            id='solutions'
        >
            <h1 className='text-5xl sm:text-6xl font-[900] text-center mb-10'>
                Feito sob medida para
                <br />
                <span className='bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 bg-clip-text text-transparent'>
                    equipes de atendimento
                </span>
            </h1>

            <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {cards.map((card, index) => (
                    <SolutionCard
                        card={card}
                        index={index}
                        key={index}
                    />
                ))}
            </div>
        </div>
    )
}
