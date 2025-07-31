import type { IWebMessageInfo } from './BaileysTypes'
import type { Attendant, Store } from './StoreTypes'

type Status = 'connected' | 'disconnected' | 'loading'

type Connection = {
    attendant: Attendant
    store: Store
}

type ChatDataFields =
    | 'name'
    | 'photo'
    | 'lastSeen'
    | 'attendingBy'
    | 'lastMessage'
    | 'isGroup'
    | 'infosLoaded'

type FieldValueMap = {
    name: string
    photo: string | null
    lastSeen: Date
    attendingBy: string | null
    lastMessage: IWebMessageInfo
    isGroup: boolean
    infosLoaded: boolean
}

export type { ChatDataFields, Connection, FieldValueMap, Status }
