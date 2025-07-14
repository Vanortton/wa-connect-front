import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { StoresContext } from '@/contexts/StoresContext'
import { UserContext } from '@/contexts/UserContext'
import { STORE_URL } from '@/globals'
import { Cog, EllipsisVertical, Loader2Icon, RotateCcw } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { toast } from 'sonner'
import QRCode from './QRCode'

type Params = { storeId: string; connectionUrl: string }
const isProd = import.meta.env.PROD

export default function ConnectStore({ storeId, connectionUrl }: Params) {
    const [tryConnect, setTryConnect] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [showQr, setShowQR] = useState<boolean>(false)
    const [token, setToken] = useState<string>('')
    const { user } = useContext(UserContext)
    const { setStores } = useContext(StoresContext)

    const socketUrl = isProd ? STORE_URL : connectionUrl
    const socketConfig = isProd
        ? {
              path: `/${connectionUrl}/socket.io`,
              transports: ['websocket', 'polling'],
          }
        : {}

    const socket = io(socketUrl, socketConfig)

    useEffect(() => {
        if (tryConnect && user) {
            setLoading(true)
            console.log('Tentando gerar o QR code')
            socket.emit('connect-store', {
                storeId: storeId,
                idToken: user.token,
            })
            socket.on('qr', (data) => {
                const qr = data.qr
                if (qr && typeof qr === 'string') {
                    setToken(qr)
                    setShowQR(true)
                    setLoading(false)
                }
            })
            socket.on('store-status', (data) => {
                const status = data.status
                if (status === 'connected') {
                    toast.success('Loja conectada com sucesso')
                    setStores((prevStores) => {
                        const updatedStores = prevStores.map((store) =>
                            store.id === storeId
                                ? { ...store, hasCreds: true }
                                : store
                        )
                        console.log(updatedStores)
                        return updatedStores
                    })
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storeId, tryConnect])

    return (
        <>
            {showQr && !loading ? (
                <>
                    <StepsToConnect />
                    <Card className='bg-white w-full'>
                        <CardContent>
                            <div className='flex items-center justify-center'>
                                <QRCode token={token} />
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <GenerateQrCode
                    setTryConnect={setTryConnect}
                    loading={loading}
                />
            )}
        </>
    )
}

function StepsToConnect() {
    return (
        <>
            <p className='text-[18px]'>Etapas para acessar:</p>
            <ol className='ps-5 list-decimal'>
                <li>Abra o WhatsApp no seu celular</li>
                <li>
                    Toque em Mais opções{' '}
                    <span className='inline-flex'>
                        <EllipsisVertical size={14} />
                    </span>{' '}
                    no Android ou em Configurações{' '}
                    <span className='inline-flex'>
                        <Cog size={14} />
                    </span>{' '}
                    no IPhone
                </li>
                <li>
                    Toque em dispositivos conectados e, em seguida, em conectar
                    dispositivo
                </li>
                <li>Escanei o QR code abaixo para confirmar</li>
            </ol>
        </>
    )
}

function GenerateQrCode({
    setTryConnect,
    loading,
}: {
    setTryConnect: (v: boolean) => void
    loading: boolean
}) {
    return (
        <>
            <p className='text-[16px]'>
                Para conectar a loja ao número de WhatsApp é necessário escanear
                o QRCode
            </p>
            <Card className='bg-white w-full'>
                <CardContent>
                    <div className='flex items-center justify-center'>
                        <div className='w-[150px] h-[150px] bg-gray-900 rounded-xl flex items-center justify-center'>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={() => setTryConnect(true)}
                                        variant='ghost'
                                        className='text-white'
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <Loader2Icon className='animate-spin' />
                                        ) : (
                                            <RotateCcw />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {loading ? 'Gerando' : 'Gerar'} o QRCode
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
