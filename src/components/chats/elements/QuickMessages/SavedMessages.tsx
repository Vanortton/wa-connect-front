import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ChatsContext } from '@/contexts/ChatsContext'
import { useContext } from 'react'

export default function SavedMessages() {
    const { quickMessages } = useContext(ChatsContext)

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
                    {quickMessages.map((msg) => (
                        <TableRow>
                            <TableCell>/{msg.shortcut}</TableCell>
                            <TableCell>{msg.text}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
