import { ChatsContext } from '@/contexts/ChatsContext'
import { BASE_URL } from '@/globals'
import type { IWebMessageInfo, MediaMessageTypes } from '@/types/BaileysTypes'
import { useContext } from 'react'
import type { Socket } from 'socket.io-client'

export default function useMessages() {
    const { connection } = useContext(ChatsContext)

    const retryDownload = async (
        socket: Socket,
        message: IWebMessageInfo,
        type: MediaMessageTypes
    ) => {
        const url = await socket.emitWithAck('retry-download', {
            jid: message.key.remoteJid,
            id: message.key.id,
            type,
        })

        return {
            id: message.key.id,
            data: () => ({
                ...message,
                message: {
                    ...message.message,
                    [`${type}Message`]: {
                        ...message.message[`${type}Message`],
                        downloadUrl: url,
                    },
                },
            }),
        }
    }

    const downloadZipMedia = async (chatId: string, messagesIds: string[]) => {
        const idsQuery = messagesIds.reduce(
            (acc, cur) => `${acc}&id=${cur}`,
            ''
        )
        window.open(
            `${BASE_URL}/download/${chatId}?${idsQuery}&token=${connection.attendant.token}`
        )
    }

    return { retryDownload, downloadZipMedia }
}
