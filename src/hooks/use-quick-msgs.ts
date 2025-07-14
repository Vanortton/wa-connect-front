import { ChatsContext } from '@/contexts/ChatsContext'
import { db } from '@/firebase'
import type { QuickMessage } from '@/types/ChatsTypes'
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    updateDoc,
} from 'firebase/firestore'
import { useContext } from 'react'
import { toast } from 'sonner'

export const useQuickMsgs = () => {
    const { connection } = useContext(ChatsContext)
    const basePath = connection
        ? `users/${connection.attendant.user}/stores/${connection.store.id}/quick-messages`
        : null

    const addQuickMsg = async ({ shortcut, text }: QuickMessage) => {
        if (!connection) return toast.error('Não conectado')

        const collRef = collection(db, basePath!)
        const newMsg = { shortcut, text }

        const docRef = await addDoc(collRef, newMsg)
        return docRef.id
    }

    const editQuickMsg = async (id: string, msg: QuickMessage) => {
        if (!connection) return toast.error('Não conectado')

        const docRef = doc(db, basePath!, id)
        await updateDoc(docRef, msg)
    }

    const removeQuickMsg = async (id: string) => {
        if (!connection) return toast.error('Não conectado')

        const docRef = doc(db, basePath!, id)
        await deleteDoc(docRef)
    }

    return {
        addQuickMsg,
        editQuickMsg,
        removeQuickMsg,
    }
}
