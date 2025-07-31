import type { Chat } from '@/types/ChatsTypes'
import { create } from 'zustand'

type ChatsState = {
    chats: Record<string, Chat>
    currentChat: string | null
    setChat: (chatId: string, chatData: Partial<Chat>) => Chat
    setManyChats: (chats: Record<string, Chat>) => void
    getChat: (chatId: string) => Chat | undefined
    removeChat: (chatId: string) => void
    setCurrentChat: (chatId: string | null) => void
}

export const useChatsStore = create<ChatsState>((set, get) => ({
    chats: {},
    currentChat: null,
    setChat: (chatId, chatData) => {
        set((state) => ({
            chats: {
                ...state.chats,
                [chatId]: {
                    ...state.chats[chatId],
                    ...chatData,
                    id: chatId,
                },
            },
        }))
        return get().chats[chatId]
    },
    setManyChats: (newChats) =>
        set((state) => {
            const current = state.chats
            const newKeys = Object.keys(newChats)

            let shouldUpdate = false

            for (const key of newKeys) {
                const currentChat = current[key]
                const newChat = newChats[key]

                if (
                    !currentChat ||
                    JSON.stringify(currentChat) !== JSON.stringify(newChat)
                ) {
                    shouldUpdate = true
                    break
                }
            }

            if (!shouldUpdate) return state

            return {
                chats: {
                    ...current,
                    ...newChats,
                },
            }
        }),
    getChat: (chatId) => get().chats[chatId],
    removeChat: (chatId) =>
        set((state) => {
            const newChats = { ...state.chats }
            delete newChats[chatId]
            return { chats: newChats }
        }),
    setCurrentChat: (chatId) =>
        set((state) => {
            const newChats = { ...state.chats }

            if (state.currentChat) {
                newChats[state.currentChat] = {
                    ...newChats[state.currentChat],
                    current: false,
                }
            }

            if (chatId) {
                newChats[chatId] = {
                    ...newChats[chatId],
                    current: true,
                }
            }

            return {
                currentChat: chatId,
                chats: newChats,
            }
        }),
}))
