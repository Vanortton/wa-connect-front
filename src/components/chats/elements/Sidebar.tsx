import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ToggleTheme } from '@/components/ui/toggle-theme'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { CircleFadingPlus, MessageSquareText } from 'lucide-react'
import Vazap from '../../../assets/vazap.webp'

export default function Sidebar() {
    const items = [
        { icon: <MessageSquareText />, label: 'Conversas', active: true },
        { icon: <CircleFadingPlus />, label: 'Status' },
    ]

    return (
        <Card className='rounded-none shadow-none border-none w-fit h-full py-5 bg-muted dark:bg-background'>
            <CardContent className='px-3 flex flex-col justify-between h-full'>
                <div className='flex flex-col items-center gap-3'>
                    <img
                        src={Vazap}
                        alt='Logo'
                        width={50}
                        className='mb-2'
                    />
                    {items.map((item, index) => (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <Button
                                    className='rounded-full size-10'
                                    variant={
                                        item.active ? 'default' : 'outline'
                                    }
                                >
                                    {item.icon}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{item.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
                <div className='flex flex-col items-center gap-3'>
                    <Button asChild>
                        <ToggleTheme />
                    </Button>
                    <Avatar className='border w-[40px] h-[40px]'>
                        <AvatarImage
                            src=''
                            alt='Foto de perfil'
                        />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </CardContent>
        </Card>
    )
}
