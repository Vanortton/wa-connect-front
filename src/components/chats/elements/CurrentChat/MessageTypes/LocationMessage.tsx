import type { IWebMessageInfo } from '@/types/BaileysTypes'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin } from 'lucide-react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function LocationMessage({
    message,
}: {
    message: IWebMessageInfo
}) {
    const { message: content } = message
    if (!content.locationMessage) return null

    const { degreesLatitude, degreesLongitude } = content.locationMessage

    return (
        <div className='px-2 py-2 bg-background/70 dark:bg-zinc-900/30 rounded-md flex flex-col gap-2 min-w-xs'>
            <div className='flex gap-2 items-center'>
                <MapPin />
                <div>
                    <p className='text-xs'>Localização</p>
                    <p className='text-sm'>
                        {degreesLatitude.toFixed(5)},{' '}
                        {degreesLongitude.toFixed(5)}
                    </p>
                </div>
            </div>

            <MapContainer
                center={[degreesLatitude, degreesLongitude]}
                zoom={16}
                scrollWheelZoom={false}
                style={{
                    height: '200px',
                    width: '100%',
                    borderRadius: '0.375rem',
                }}
            >
                <TileLayer
                    url='https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg'
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[degreesLatitude, degreesLongitude]}>
                    <Popup>Localização enviada</Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}
