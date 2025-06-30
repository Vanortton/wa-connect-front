import { Outlet } from 'react-router'
import Vazap from '../../assets/vazap.webp'
import { Card, CardContent } from '../ui/card'

export default function Auth() {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center gap-5'>
            <div className='flex items-center gap-2'>
                <img
                    src={Vazap}
                    alt='Logo'
                    width={50}
                />
                <p className='text-2xl font-bold'>VAZAP</p>
            </div>
            <Card className='w-full max-w-md'>
                <CardContent>
                    <Outlet />
                </CardContent>
            </Card>
        </div>
    )
}
