import { ChatsContext } from '@/contexts/ChatsContext'
import { useAttendant } from '@/hooks/use-attendant'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router'
import ChatsList from './elements/ChatsList/ChatsList'
import CurrentChat from './elements/CurrentChat/CurrentChat'
import Sidebar from './elements/Sidebar'
import Topbar from './elements/Topbar'

export default function Chats() {
    const { connect } = useAttendant()
    const { socketRef } = useContext(ChatsContext)
    const navigate = useNavigate()

    useEffect(() => {
        const savedToken = localStorage.getItem('attendant-token')
        if (savedToken)
            connect(savedToken).then((socket) => (socketRef.current = socket))
        else navigate('/connect')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='h-screen w-screen flex flex-col overflow-hidden'>
            <Topbar />
            <div className='flex w-full flex-1 min-h-0 overflow-hidden'>
                <Sidebar />
                <ChatsList />
                <CurrentChat />
            </div>
        </div>
    )
}
