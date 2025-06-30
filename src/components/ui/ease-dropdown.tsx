import type { ReactNode } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './dropdown-menu'

type EaseDropdownParams = {
    trigger: ReactNode
    items: { onClick: () => void; label: string }[]
}

export default function EaseDropdown({ trigger, items }: EaseDropdownParams) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
            <DropdownMenuContent>
                {items.map((item) => (
                    <DropdownMenuItem onClick={item.onClick}>
                        {item.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
