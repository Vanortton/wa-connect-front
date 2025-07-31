import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import EaseTooltip from '@/components/ui/ease-tooltip'
import { Input } from '@/components/ui/input'
import { useLabels } from '@/hooks/use-labels'
import { useLabelsStore } from '@/zustand/LabelsStore'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { EllipsisVertical, Plus, Search, Tag, Trash } from 'lucide-react'
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

export function Filters({ filters, onChange }: FiltersParams) {
    const [selectedFilter, setSelectedFilter] = useState<string>('all')
    const [newLabelName, setNewLabelName] = useState('')
    const [newLabelColor, setNewLabelColor] = useState('#22c55e')
    const labels = useLabelsStore((s) => s.labels)
    const { addLabel, removeLabel } = useLabels()

    const handleChange = (key: string) => {
        onChange(key)
        setSelectedFilter(key)
    }

    const handleAddLabel = async () => {
        if (!newLabelName.trim()) return
        await addLabel({
            name: newLabelName.trim(),
            color: newLabelColor,
        })
        setNewLabelName('')
        setNewLabelColor('#22c55e')
    }

    return (
        <div className='flex gap-2 overflow-x-auto scrollbar-transparent pb-2'>
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
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className='rounded-full h-auto py-1 px-3'
                        variant={
                            selectedFilter.startsWith('tag-')
                                ? 'default'
                                : 'outline'
                        }
                    >
                        <Tag className='mr-1 size-4' />
                        {selectedFilter.startsWith('tag-')
                            ? labels[
                                  parseInt(selectedFilter.replace('tag-', ''))
                              ]?.name || 'Etiqueta'
                            : 'Etiquetas'}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-64'>
                    <div className='flex items-center px-2 pt-2'>
                        <input
                            type='color'
                            className='p-1 h-9 w-10 bg-white border border-gray-200 border-r-0 cursor-pointer rounded-l-lg dark:bg-neutral-900 dark:border-neutral-700'
                            value={newLabelColor}
                            onChange={(e) => setNewLabelColor(e.target.value)}
                            title='Escolha a cor'
                        />
                        <Input
                            placeholder='Nova etiqueta'
                            value={newLabelName}
                            onChange={(e) => setNewLabelName(e.target.value)}
                            className='rounded-none'
                        />
                        <Button
                            onClick={handleAddLabel}
                            className='size-9 rounded-l-none px-0'
                        >
                            <Plus className='size-4' />
                        </Button>
                    </div>

                    <div className='mt-2 flex flex-col gap-1 px-1 pb-2'>
                        {Object.values(labels).map((label) => (
                            <DropdownMenuItem
                                key={label.id}
                                onClick={() => handleChange(`tag-${label.id}`)}
                                className='gap-2 cursor-pointer flex justify-between'
                            >
                                <div className='flex gap-2'>
                                    <Tag
                                        className='size-4'
                                        style={{ color: label.color }}
                                    />
                                    {label.name}
                                </div>
                                <Button
                                    variant='ghost'
                                    className='size-5'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeLabel(label.id)
                                    }}
                                >
                                    <Trash className='text-red-500' />
                                </Button>
                            </DropdownMenuItem>
                        ))}
                        {Object.values(labels).length === 0 && (
                            <span className='text-sm text-muted-foreground px-2 py-1'>
                                Nenhuma etiqueta
                            </span>
                        )}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
