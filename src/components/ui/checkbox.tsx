import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import * as React from 'react'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string
}

function Checkbox({ className, ...props }: CheckboxProps) {
    return (
        <label
            className={cn(
                'inline-flex items-center justify-center size-4 rounded border has-checked:border-none bg-background transition-colors cursor-pointer relative rounded-sm',
                className
            )}
        >
            <input
                type='checkbox'
                className='sr-only peer'
                {...props}
            />
            <span className='absolute border-input peer-checked:border-none rounded-sm inset-0 flex items-center justify-center pointer-events-none peer-checked:bg-primary peer-checked:opacity-100 opacity-0 transition-opacity'>
                <Check
                    className='w-3 h-3 text-white'
                    strokeWidth={3}
                />
            </span>
        </label>
    )
}

export { Checkbox }
