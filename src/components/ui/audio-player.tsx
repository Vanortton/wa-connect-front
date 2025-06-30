'use client'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function AudioPlayer({ src }: { src: string }) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    const togglePlay = () => {
        const audio = audioRef.current
        if (!audio) return

        if (isPlaying) audio.pause()
        else audio.play()

        setIsPlaying(!isPlaying)
    }

    const handleTimeUpdate = () => {
        const audio = audioRef.current
        if (!audio) return
        setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
        const audio = audioRef.current
        if (!audio) return
        setDuration(audio.duration)
    }

    const handleSeek = (value: number[]) => {
        const audio = audioRef.current
        if (!audio) return
        audio.currentTime = value[0]
        setCurrentTime(value[0])
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        audio.addEventListener('ended', () => setIsPlaying(false))

        return () => {
            audio.removeEventListener('ended', () => setIsPlaying(false))
        }
    }, [])

    return (
        <div className='w-full max-w-md rounded-2xl flex flex-col gap-3'>
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
            />
            <div className='flex items-center justify-between gap-3'>
                <Button
                    onClick={togglePlay}
                    variant='ghost'
                    size='icon'
                    className='size-6'
                >
                    {isPlaying ? (
                        <Pause className='h-6 w-6' />
                    ) : (
                        <Play className='h-6 w-6' />
                    )}
                </Button>
                <Slider
                    value={[currentTime]}
                    onValueChange={handleSeek}
                    max={duration}
                    step={0.1}
                    className='w-full min-w-[100px]'
                />
                <span className='text-xs text-nowrap'>
                    {formatTime(currentTime)} - {formatTime(duration)}
                </span>
            </div>
        </div>
    )
}
