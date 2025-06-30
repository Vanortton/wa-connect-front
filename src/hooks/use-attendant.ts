import { ChatsContext } from '@/contexts/ChatsContext'
import { auth } from '@/firebase'
import axios from 'axios'
import { signInWithCustomToken, signOut } from 'firebase/auth'
import { useContext } from 'react'
import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'
import { useChats } from './use-chats'
export const useAttendant = () => {
    const { addListeners } = useChats()
    const { setConnectionStatus, setConnection } = useContext(ChatsContext)

    const getConnectionData = async (token: string) => {
        const response = await axios.get(
            'http://localhost:3000/connection',
            {
                params: { token },
            }
        )
        return response.data.attendant
    }

    const connect = async (token: string) => {
        setConnectionStatus('loading')
        const connectionData = await getConnectionData(token)
        const { attendant, store } = connectionData
        const serverUrl = store.connectionUrl

        await signInWithCustomToken(auth, attendant.authToken)
        localStorage.setItem('attendant-token', token)
        setConnection(connectionData)

        if (!serverUrl) throw 'Não foi possível localizar servidor'
        const socket = io('https://stores.vazap.com.br', {
        path: `/${serverUrl}/socket.io`,
        transports: ['websocket', 'polling'],
    })

        socket.on('connect', () => {
            addListeners({ socket })
            socket.emit('connect-attendant', { token })
        })

        return socket
    }

    const disconnect = (socket: Socket) => {
        if (socket) socket.disconnect()
        signOut(auth)
        toast.dismiss()
    }

    return { connect, disconnect }
}
