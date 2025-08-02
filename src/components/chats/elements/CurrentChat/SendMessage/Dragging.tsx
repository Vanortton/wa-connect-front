import { Upload } from 'lucide-react'

export default function Dragging() {
    return (
        <div className='absolute inset-0 flex items-center justify-center w-full bg-muted shadow-md h-16 top-[-160%] rounded-lg flex gap-2 shadow-md'>
            <Upload />
            Solte o arquivo aqui
        </div>
    )
}
