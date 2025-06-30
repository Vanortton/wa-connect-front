import { SidebarTrigger } from '@/components/ui/sidebar'

export default function PageHeader({ title }: { title: string }) {
    return (
        <div className='flex items-center gap-3 mb-4'>
            <SidebarTrigger />
            <h1 className='text-2xl font-bold'>{title}</h1>
        </div>
    )
}
