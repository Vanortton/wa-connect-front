import { RotateCcw } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '../../../../ui/button'

export default function QRCode({ token }: { token?: string }) {
    return (
        <div className='min-w-[150px] w-full max-w-[150px]'>
            {token ? (
                <QRCodeSVG
                    value={token}
                    size={150}
                />
            ) : (
                <Button className='w-[150px] h-[150px] rounded-2xl flex items-center justify-center'>
                    <RotateCcw color='white' />
                </Button>
            )}
        </div>
    )
}
