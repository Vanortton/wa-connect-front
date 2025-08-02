import { Loader2 } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url'
import React, { useEffect, useRef, useState } from 'react'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

function PDFPreview({ file, className }: { file: File; className?: string }) {
    const [imgUrl, setImgUrl] = useState<string | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const renderFirstPage = async () => {
            const fileReader = new FileReader()
            fileReader.onload = async function () {
                const typedarray = new Uint8Array(this.result as ArrayBuffer)
                const pdf = await pdfjsLib.getDocument({ data: typedarray })
                    .promise
                const page = await pdf.getPage(1)

                const viewport = page.getViewport({ scale: 1.5 })
                const canvas = canvasRef.current
                if (!canvas) return
                const context = canvas.getContext('2d')
                if (!context) return

                canvas.width = viewport.width
                canvas.height = viewport.height

                await page.render({
                    canvas,
                    canvasContext: context,
                    viewport,
                }).promise

                const dataUrl = canvas.toDataURL()
                setImgUrl(dataUrl)
            }
            fileReader.readAsArrayBuffer(file)
        }

        renderFirstPage()
    }, [file])

    if (!imgUrl)
        return (
            <React.Fragment>
                <canvas
                    ref={canvasRef}
                    style={{ display: 'none' }}
                />
                <div className='min-h-30 w-full max-w-3xs bg-muted rounded-md flex justify-center items-center'>
                    <Loader2 className='animate-spin' />
                </div>
            </React.Fragment>
        )

    return (
        <img
            src={imgUrl}
            className={className}
            alt='PDF preview'
        />
    )
}

export { PDFPreview }
