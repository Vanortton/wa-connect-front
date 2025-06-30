import type { User as FirebaseUser } from 'firebase/auth'

type User =
    | (FirebaseUser & { status: 'loading' | 'connected'; token: string })
    | null

export type { User }
