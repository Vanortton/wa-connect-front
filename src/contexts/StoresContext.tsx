import { useStores } from '@/hooks/use-stores'
import type { Store } from '@/types/StoreTypes'
import type { User } from '@/types/UserTypes'
import {
    createContext,
    useEffect,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from 'react'

type Context = {
    stores: Store[]
    loading: boolean
    setStores: Dispatch<SetStateAction<Store[]>>
    fetchStores: (u: User) => void
}

const StoresContext = createContext<Context>({} as Context)

function StoresProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState<boolean>(false)
    const [stores, setStores] = useState<Store[]>([])
    const { getStores } = useStores()

    const fetchStores = (user: User) => {
        if (!user || !user.token) return
        setLoading(true)
        getStores(user.token).then((stores) => {
            setStores(stores)
            setLoading(false)
        })
    }

    useEffect(() => {
        console.log(stores)
    }, [stores])

    return (
        <StoresContext.Provider
            value={{ stores, loading, setStores, fetchStores }}
        >
            {children}
        </StoresContext.Provider>
    )
}

export { StoresContext, StoresProvider }
