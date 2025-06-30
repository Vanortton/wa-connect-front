type Attendant = {
    name: string
    token: string
    online: boolean
    user: string
    store: string
}

type Store = {
    id: string
    surname: string
    hasCreds: boolean
    attendants?: Attendant[]
    connectionUrl: string
}

export type { Attendant, Store }
