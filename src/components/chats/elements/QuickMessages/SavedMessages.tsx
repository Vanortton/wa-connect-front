import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

export default function SavedMessages() {
    const quickMsgs = [
        {
            shortcut: '/bom dia',
            text: 'Bom dia, aqui é a VANSISTEM. Agradecemos o seu contato, o nosso suporte funciona de segunda a sábado das 08:00h até as 18:00h. Em breve um dos nossos atendentes irá retornar sua mensagem, agradecemos a paciência.',
        },
        {
            shortcut: '/boa tarde',
            text: 'Boa tarde, aqui é a VANSISTEM. Agradecemos o seu contato. Nosso suporte está disponível de segunda a sábado das 08:00h às 18:00h. Um de nossos atendentes irá te responder em breve.',
        },
        {
            shortcut: '/aguarde',
            text: 'Só um momento, por favor. Já estamos verificando a sua solicitação e em breve retornamos com a resposta.',
        },
        {
            shortcut: '/fora horario',
            text: 'Olá! No momento estamos fora do nosso horário de atendimento, que é de segunda a sábado das 08:00h às 18:00h. Assim que estivermos online, retornaremos seu contato.',
        },
        {
            shortcut: '/resolvido',
            text: 'Finalizamos o seu atendimento. Caso precise de mais alguma coisa, estamos à disposição. Agradecemos por contar com a VANSISTEM!',
        },
        {
            shortcut: '/link acesso',
            text: 'Aqui está o link de acesso ao seu painel: https://painel.vansistem.com.br. Qualquer dúvida estamos à disposição!',
        },
        {
            shortcut: '/erro comum',
            text: 'Esse é um erro comum quando a conexão com a internet oscila. Tente recarregar a página ou reiniciar o sistema. Caso o problema continue, me avisa por aqui.',
        },
    ]

    return (
        <div className='scrollbar-transparent relative w-full overflow-x-auto'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Atalho</TableHead>
                        <TableHead>Texto</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {quickMsgs.map((msg) => (
                        <TableRow>
                            <TableCell>{msg.shortcut}</TableCell>
                            <TableCell>{msg.text}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
