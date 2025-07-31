import { ChatsContext } from '@/contexts/ChatsContext'
import { db } from '@/firebase'
import type { Label } from '@/types/LabelsTypes'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { useContext } from 'react'
import { toast } from 'sonner'

export const useLabels = () => {
    const { connection } = useContext(ChatsContext)
    const basePath = connection
        ? `users/${connection?.attendant?.user}/stores/${connection?.store?.id}`
        : null

    const addLabel = async ({ color, name }: Partial<Omit<Label, 'id'>>) => {
        if (!connection || !basePath) return toast.error('Não conectado')

        const id = Date.now()
        const docRef = doc(db, basePath)
        await setDoc(
            docRef,
            { labels: { [id]: { name, color, id } } },
            { merge: true }
        )
    }

    const updateLabel = async (
        id: number,
        updates: Partial<Omit<Label, 'id'>>
    ) => {
        if (!connection || !basePath) return toast.error('Não conectado')
        const docRef = doc(db, basePath)
        await setDoc(docRef, { labels: { [id]: updates } }, { merge: true })
    }

    const removeLabel = async (id: number) => {
        if (!connection || !basePath) return toast.error('Não conectado')

        const docRef = doc(db, basePath)
        const snapshot = await getDoc(docRef)

        if (!snapshot.exists()) return toast.error('Loja não encontrada')
        const docData = snapshot.data()
        if (!docData) return toast.error('Nenhuma etiqueta para remover')

        const newLabels = (docData.labels as Record<string, Label>) || {}
        delete newLabels[id]

        await updateDoc(docRef, { labels: newLabels })
    }

    return { addLabel, updateLabel, removeLabel }
}
