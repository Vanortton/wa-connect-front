import { Button } from '@/components/ui/button'
import { ChatsContext } from '@/contexts/ChatsContext'
import { decodeWaveform } from '@/helpers/messages'
import useMessages from '@/hooks/use-messages'
import type { IAudioMessage, IWebMessageInfo } from '@/types/BaileysTypes'
import { useChatMessages } from '@/zustand/MessagesStore'
import { Download, Loader2Icon, Pause, Play } from 'lucide-react'
import { useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0')
    const secs = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0')
    return `${mins}:${secs}`
}

export default function AudioMessage({
    message,
}: {
    message: IWebMessageInfo
}) {
    const { retryDownload } = useMessages()
    const { socketRef } = useContext(ChatsContext)
    const { message: content } = message
    const updateMessage = useChatMessages((s) => s.updateMessage)
    const [loading, setLoading] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)

    const audioRef = useRef<HTMLAudioElement | null>(null)
    const progressRef = useRef<HTMLDivElement | null>(null)

    const { waveform, downloadUrl, seconds } =
        content.audioMessage as IAudioMessage

    const wavesFallback = Array.from(new Array(64), () => 2)
    const decodedForm = decodeWaveform(waveform) || wavesFallback

    async function handleDownload() {
        try {
            setLoading(true)
            if (!socketRef.current) return

            const updatedMsg = await retryDownload(
                socketRef.current,
                message,
                'audio'
            )
            updateMessage(updatedMsg)
        } catch (err) {
            toast.error('Não foi possível baixar o áudio')
            console.error('Erro ao baixar áudio:', err)
        } finally {
            setLoading(false)
        }
    }

    function togglePlayback() {
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
    }

    function seekAudio(e: React.MouseEvent<HTMLDivElement>) {
        if (!audioRef.current || !progressRef.current) return
        const rect = progressRef.current.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const percent = clickX / rect.width
        audioRef.current.currentTime = percent * audioRef.current.duration
    }

    useEffect(() => {
        if (!audioRef.current) return

        const audio = audioRef.current

        const onTimeUpdate = () => {
            const current = audio.currentTime
            const duration = audio.duration
            setProgress((current / duration) * 100)
        }

        const onEnded = () => {
            setIsPlaying(false)
            setProgress(0)
        }

        const onPlay = () => setIsPlaying(true)
        const onPause = () => setIsPlaying(false)

        audio.addEventListener('timeupdate', onTimeUpdate)
        audio.addEventListener('ended', onEnded)
        audio.addEventListener('play', onPlay)
        audio.addEventListener('pause', onPause)

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate)
            audio.removeEventListener('ended', onEnded)
            audio.removeEventListener('play', onPlay)
            audio.removeEventListener('pause', onPause)
        }
    }, [])

    return (
        <div className='flex items-center gap-2 py-1 px-2 w-full relative'>
            {downloadUrl ? (
                <Button
                    size='icon'
                    variant='ghost'
                    className='p-1 h-auto w-auto'
                    onClick={togglePlayback}
                    type='button'
                >
                    {isPlaying ? <Pause /> : <Play />}
                </Button>
            ) : (
                <Button
                    size='icon'
                    variant='ghost'
                    className='p-1 h-auto w-auto'
                    onClick={handleDownload}
                    type='button'
                >
                    {loading ? (
                        <Loader2Icon className='animate-spin' />
                    ) : (
                        <Download />
                    )}
                </Button>
            )}

            <div
                ref={progressRef}
                className='relative flex items-center gap-[1px] h-[32px] flex-1 cursor-pointer group'
                onClick={seekAudio}
            >
                {decodedForm.map((item, index) => {
                    const percentage = item / 255
                    const pixels = Math.floor(60 * percentage)
                    const height = pixels > 2 ? pixels : 2
                    const isActive =
                        (index / decodedForm.length) * 100 < progress

                    return (
                        <div
                            key={index}
                            className={`w-[2px] rounded-sm ${
                                isActive
                                    ? 'bg-green-500'
                                    : 'bg-foreground/40 group-hover:bg-foreground/60'
                            }`}
                            style={{ height: `${height}px` }}
                        />
                    )
                })}

                <div
                    className='w-[8px] h-[8px] bg-green-600 rounded-full absolute left-0'
                    style={{
                        left: `${progress}%`,
                    }}
                ></div>
            </div>
            <div className='absolute bottom-[-1.2rem] left-0 text-[10px] text-muted-foreground'>
                {formatTime(audioRef.current?.currentTime || 0)} /{' '}
                {formatTime(seconds)}
            </div>

            <audio
                ref={audioRef}
                src={downloadUrl}
                preload='metadata'
            />
        </div>
    )
}
