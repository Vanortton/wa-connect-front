import type { Message } from './ChatsTypes'
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
    lastMessage: Message
    isGroup: boolean
    infosLoaded: boolean
}

export type { ChatDataFields, Connection, FieldValueMap, Status }
