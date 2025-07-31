import type { DocumentData } from 'firebase/firestore'
import { create } from 'zustand'

type ChatMessagesStore = {
    messages: DocumentData[]
    loadingMessages: boolean
    setMessages: (msgs: DocumentData[]) => void
    addMessage: (msg: DocumentData, last?: boolean) => void
    updateMessage: (msg: DocumentData) => void
    removeMessage: (msgId: string) => void
    clearMessages: () => void
    setLoadingMessages: (v: boolean) => void
}

export const useChatMessages = create<ChatMessagesStore>((set) => ({
    messages: [],
    loadingMessages: true,

    setMessages: (msgs) => set({ messages: msgs }),

    addMessage: (msg, last) =>
        set((state) => {
            if (last) return { messages: [msg, ...state.messages] }
            else return { messages: [...state.messages, msg] }
        }),

    updateMessage: (msg) =>
        set((state) => ({
            messages: state.messages.map((m) =>
                m.id === msg.id ? { ...m, ...msg } : m
            ),
        })),

    removeMessage: (msgId) =>
        set((state) => ({
            messages: state.messages.filter((m) => m.id !== msgId),
        })),

    clearMessages: () => set({ messages: [] }),

    setLoadingMessages: (isLoading) => set({ loadingMessages: isLoading }),
}))
