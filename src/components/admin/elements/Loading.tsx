import { Loader2Icon } from 'lucide-react'

export default function Loading({ message }: { message: string }) {
    return (
        <div className='flex flex-col gap-2 justify-center items-center w-full h-full'>
            <Loader2Icon className='animate-spin' />
            <p>{message}</p>
        </div>
    )
}
