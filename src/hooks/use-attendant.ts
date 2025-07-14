import { ChatsContext } from '@/contexts/ChatsContext'
import { auth } from '@/firebase'
import { BASE_URL, STORE_URL } from '@/globals'
import type { Store } from '@/types/StoreTypes'
import axios from 'axios'
import { signInWithCustomToken, signOut } from 'firebase/auth'
import { useContext } from 'react'
import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'
import { useChats } from './use-chats'

const isProd = import.meta.env.PROD

export const useAttendant = () => {
    const { addListeners } = useChats()
    const { setConnectionStatus, setConnection } = useContext(ChatsContext)

    const getConnectionData = async (token: string) => {
        const response = await axios.get(`${BASE_URL}/connection`, {
            params: { token },
        })
        return response.data.attendant
    }

    const startVM = async (token: string, storeId: string) => {
        const response = await axios.post(
            `${BASE_URL}/store/${storeId}/start`,
            { token }
        )
        return response.data.status
    }

    const getBackStatus = async (token: string, storeId: string) => {
        const response = await axios.get(
            `${BASE_URL}/store/${storeId}/status`,
            { params: { token } }
        )
        return response.data.status
    }

    const awaitBackStart = async (token: string, store: Store) => {
        const id = toast('')
        toast.loading('Conectando serviço', { id })

        let attempts = 0
        let vmRunning = false

        while (true) {
            try {
                if (attempts > 120) {
                    toast.error(
                        'Não foi possível estabelecer conexão com os servidores',
                        { id }
                    )
                    return false
                } else if (attempts > 60)
                    toast.loading('Está demorando mais que o esperado', { id })
                else if (attempts > 30)
                    toast.loading('Ainda conectando, aguarde', { id })
                else if (attempts > 1 && !vmRunning)
                    toast.loading(
                        'Inicializando servidores, isso pode levar alguns segundos',
                        { id }
                    )

                if (!vmRunning) {
                    const status = await getBackStatus(token, store.id)
                    if (status === 'RUNNING') vmRunning = true
                    else if (status === 'TERMINATED' && isProd)
                        startVM(token, store.id)
                }

                if (vmRunning) {
                    try {
                        const url = import.meta.env.PROD
                            ? `https://stores.vazap.com.br/${store.connectionUrl}/health`
                            : `${store.connectionUrl}/health`
                        console.log('Verificando se tá vivo:', url)
                        await axios.get(url)
                        toast.dismiss(id)
                        return true
                    } catch {
                        console.log('Aguardando')
                    }
                }

                await new Promise((r) => setTimeout(r, 1000))
            } catch (error) {
                console.log(error)
            } finally {
                attempts += 1
            }
        }
    }

    const connect = async (token: string) => {
        console.log('Inicializando conexão')
        setConnectionStatus('loading')
        const connectionData = await getConnectionData(token)
        const { attendant, store } = connectionData
        const serverUrl = store.connectionUrl

        await signInWithCustomToken(auth, attendant.authToken)
        localStorage.setItem('attendant-token', token)
        setConnection(connectionData)

        if (!serverUrl) throw 'Não foi possível localizar servidor'
        const running = await awaitBackStart(token, store)
        if (!running)
            throw 'Os servidores demoraram muito para responder, aguarde alguns minutos e tente novamente'

        const socketUrl = isProd ? STORE_URL : serverUrl
        const socketConfig = isProd
            ? {
                  path: `/${serverUrl}/socket.io`,
                  transports: ['websocket', 'polling'],
              }
            : {}

        const socket = io(socketUrl, socketConfig)

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
