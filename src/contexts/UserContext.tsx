import { auth } from '@/firebase'
import type { User } from '@/types/UserTypes'
import { onAuthStateChanged } from 'firebase/auth'
import { createContext, useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'

type Context = { user: User }

const UserContext = createContext<Context>({} as Context)

function UserProvider({ children }: { children: ReactNode }) {
    const initialState = { status: 'loading' }
    const [user, setUser] = useState<User>(initialState as User)
    const navigate = useNavigate()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                user.getIdToken().then((token) => {
                    setUser({ ...user, status: 'connected', token: token })
                })
            } else {
                setUser(null)
                navigate('/auth')
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
    )
}

export { UserContext, UserProvider }
