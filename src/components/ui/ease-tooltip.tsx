import type { ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

type EaseTooltipParams = {
    trigger: ReactNode
    title: string
}

export default function EaseTooltip({ trigger, title }: EaseTooltipParams) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>{trigger}</TooltipTrigger>
            <TooltipContent>{title}</TooltipContent>
        </Tooltip>
    )
}
