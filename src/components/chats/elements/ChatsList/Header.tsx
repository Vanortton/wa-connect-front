import { Button } from '@/components/ui/button'
import EaseTooltip from '@/components/ui/ease-tooltip'
import { Input } from '@/components/ui/input'
import { EllipsisVertical, Plus, Search } from 'lucide-react'
import { useState } from 'react'

type HeaderParams = {
    filters: { key: string; label: string }[]
    onFilter: (key: string) => void
    onSearch: (k: string) => void
}

type SearchChatParams = {
    onChange: (s: string) => void
}

type FiltersParams = {
    filters: { key: string; label: string }[]
    onChange: (k: string) => void
}

type ActionBtn = {
    variant: 'ghost'
    size: 'icon'
    className: string
}

export default function Header({ filters, onFilter, onSearch }: HeaderParams) {
    return (
        <div className='px-6'>
            <div className='flex gap-5 items-center justify-between mb-3 pt-4'>
                <p className='text-xl font-semibold'>Conversas</p>
                <Actions />
            </div>

            <SearchChat onChange={onSearch} />

            <Filters
                filters={filters}
                onChange={onFilter}
            />
        </div>
    )
}

function Actions() {
    const actionBtn: ActionBtn = {
        variant: 'ghost',
        size: 'icon',
        className: 'rounded-full',
    }
    return (
        <div className='flex gap-2'>
            <EaseTooltip
                trigger={
                    <Button {...actionBtn}>
                        <Plus />
                    </Button>
                }
                title='Em breve'
            />
            <EaseTooltip
                trigger={
                    <Button {...actionBtn}>
                        <EllipsisVertical />
                    </Button>
                }
                title='Em breve'
            />
        </div>
    )
}

function SearchChat({ onChange }: SearchChatParams) {
    return (
        <div className='relative mb-3'>
            <Search
                size={18}
                className='absolute top-[50%] left-4 translate-y-[-50%] text-muted-foreground'
            />
            <Input
                placeholder='Pesquisar'
                className='ps-10 rounded-full shadow-none border-border bg-muted py-5'
                onChange={(e) => onChange(e.target.value)}
                autoComplete='off'
            />
        </div>
    )
}

function Filters({ filters, onChange }: FiltersParams) {
    const [selectedFilter, setSelectedFilter] = useState<string>('all')

    const handleChange = (key: string) => {
        onChange(key)
        setSelectedFilter(key)
    }

    return (
        <div className='flex gap-2'>
            {filters.map((item) => (
                <Button
                    className='rounded-full h-auto py-1 px-3'
                    variant={
                        item.key === selectedFilter ? 'default' : 'outline'
                    }
                    onClick={() => handleChange(item.key)}
                    key={item.key}
                >
                    {item.label}
                </Button>
            ))}
        </div>
    )
}
