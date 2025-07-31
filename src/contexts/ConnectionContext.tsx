import type { Status } from '@/types/ChatsContextTypes'
import type { Attendant, Store } from '@/types/StoreTypes'
import {
    createContext,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from 'react'

type Context = {
    status: Status
    setStatus: Dispatch<SetStateAction<Status>>
    currentAttendant: Attendant | null
    setCurrentAttendant: Dispatch<SetStateAction<Attendant | null>>
    storeConnected: Store | null
    setStoreConnected: Dispatch<SetStateAction<Store | null>>
}

const ConnectionContext = createContext<Context>({} as Context)

function ConnectionProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<Status>('disconnected')
    const [currentAttendant, setCurrentAttendant] = useState<Attendant | null>(
        null
    )
    const [storeConnected, setStoreConnected] = useState<Store | null>(null)

    return (
        <ConnectionContext.Provider
            value={{
                status,
                setStatus,
                currentAttendant,
                setCurrentAttendant,
                storeConnected,
                setStoreConnected,
            }}
        >
            {children}
        </ConnectionContext.Provider>
    )
}

export { ConnectionContext, ConnectionProvider }
