import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { AccordionContent } from '@radix-ui/react-accordion'
import { motion } from 'framer-motion'

export default function Faq() {
    const questions = [
        {
            title: 'Posso usar o mesmo número em quantos dispositivos?',
            answer: 'Você pode conectar quantos dispositivos quiser ao mesmo número de WhatsApp, sem nenhuma limitação. Todos os membros da sua equipe podem usar o mesmo número simultaneamente, seja no computador, tablet ou celular. Isso significa que você pode ter atendentes trabalhando de casa, na loja física, ou de qualquer lugar, todos conectados ao mesmo número principal da empresa. A sincronização é instantânea e automática, garantindo que toda a equipe tenha acesso às mesmas conversas em tempo real.',
        },
        {
            title: 'Preciso de celular sempre online?',
            answer: 'Sim, assim como o WhatsApp Web funciona, você precisa manter um celular principal conectado à internet para que o sistema funcione corretamente. Este celular funciona como o "hub" central que distribui as conexões para todos os outros dispositivos. Recomendamos deixar um celular dedicado sempre conectado na empresa para garantir o funcionamento contínuo do sistema. O VAZAP foi otimizado para usar o mínimo de bateria e dados possível, então você pode deixar o dispositivo conectado sem preocupações.',
        },
        {
            title: 'É seguro e confiável?',
            answer: 'Absolutamente seguro. O VAZAP utiliza a mesma tecnologia de criptografia ponta-a-ponta do WhatsApp oficial. A autenticação é feita localmente no seu dispositivo através do QR Code, e todos os dados são criptografados antes de serem transmitidos. Não armazenamos suas mensagens ou dados pessoais em nossos servidores. Sua privacidade e segurança são nossa prioridade máxima. Além disso, nosso sistema possui certificações de segurança e passa por auditorias regulares para garantir a proteção total dos seus dados.',
        },
        {
            title: 'Funciona em qualquer navegador?',
            answer: 'Sim, o VAZAP é totalmente compatível com todos os navegadores modernos: Chrome, Firefox, Safari, Edge e Opera. Funciona perfeitamente tanto no desktop quanto no mobile, sem necessidade de downloads ou instalações especiais. A interface é responsiva e se adapta automaticamente ao tamanho da sua tela, proporcionando uma experiência otimizada em qualquer dispositivo. Recomendamos usar as versões mais recentes dos navegadores para melhor performance e segurança.',
        },
        {
            title: 'Preciso instalar algum programa?',
            answer: 'Não é necessário instalar nenhum software adicional. O VAZAP funciona 100% no navegador web, como uma aplicação online moderna. Basta acessar nossa plataforma, fazer o login da sua conta e conectar seu WhatsApp através do QR Code. É simples, rápido e não ocupa espaço no seu dispositivo. Você pode começar a usar imediatamente após a contratação. A única coisa que você precisa é de uma conexão estável com a internet.',
        },
    ]

    return (
        <div
            className='px-10 py-16'
            id='faq'
        >
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className='text-5xl sm:text-6xl font-[900] text-center mb-10'
            >
                Perguntas
                <br />
                <span className='bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 bg-clip-text text-transparent'>
                    frequentes
                </span>
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <Card className='shadow-2xl max-w-[900px] mx-auto'>
                    <CardContent>
                        <Accordion
                            type='single'
                            collapsible
                        >
                            {questions.map((question, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{
                                        delay: index * 0.1,
                                        duration: 0.5,
                                        ease: 'easeOut',
                                    }}
                                >
                                    <AccordionItem value={`item-${index}`}>
                                        <AccordionTrigger className='text-xl'>
                                            {question.title}
                                        </AccordionTrigger>
                                        <AccordionContent className='pt-0 text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed pb-8'>
                                            {question.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                </motion.div>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
