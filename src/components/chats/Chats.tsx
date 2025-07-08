import { ChatsContext } from '@/contexts/ChatsContext'
import { useAttendant } from '@/hooks/use-attendant'
import { Loader2Icon } from 'lucide-react'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router'
import ChatsList from './elements/ChatsList/ChatsList'
import CurrentChat from './elements/CurrentChat/CurrentChat'
import Sidebar from './elements/Sidebar'
import Topbar from './elements/Topbar'

export default function Chats() {
    const { connect } = useAttendant()
    const { connectionStatus, socketRef } = useContext(ChatsContext)
    const navigate = useNavigate()

    useEffect(() => {
        const savedToken = localStorage.getItem('attendant-token')
        if (savedToken && connectionStatus === 'disconnected')
            connect(savedToken).then((socket) => (socketRef.current = socket))
        else if (!savedToken) navigate('/connect')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='h-screen w-screen flex flex-col overflow-hidden'>
            {connectionStatus === 'loading' && (
                <div className='w-screen h-screen fixed top-0 left-0 bg-background z-100 flex flex-col gap-2 items-center justify-center'>
                    <Loader2Icon className='animate-spin' />
                    <h1>Tentando conectar</h1>
                </div>
            )}
            <Topbar />
            <div className='flex w-full flex-1 min-h-0 overflow-hidden'>
                <Sidebar />
                <ChatsList />
                <CurrentChat />
            </div>
        </div>
    )
}
