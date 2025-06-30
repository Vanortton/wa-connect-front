import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Store as StoreType } from '@/types/StoreTypes'
import { Store, Trash } from 'lucide-react'
import { useState } from 'react'
import Attendants from './Attendants'
import ConnectStore from './ConnectStore'
import RemoveStore from './RemoveStore'
import SyncContacts from './SyncContacts'

export default function StoreItem({
    store,
    index,
}: {
    store: StoreType
    index: number
}) {
    const [open, setOpen] = useState<boolean>(false)
    const hasAttendants = store.attendants && store.attendants.length > 0
    const storeStatusColor = store.hasCreds ? 'text-green-500' : 'text-red-500'
    const storeStatus = store.hasCreds ? 'Conectado' : 'Desconectado'

    return (
        <>
            <Card className='shadow-none p-0'>
                <CardContent>
                    <AccordionItem value={`item-${index}`}>
                        <AccordionTrigger className='items-center hover:no-underline'>
                            <div className='flex items-center gap-3'>
                                <div className='p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-md shadow-lg w-fit'>
                                    <Store
                                        size={20}
                                        className='text-white'
                                    />
                                </div>
                                <div>
                                    <h2 className='text-lg'>{store.surname}</h2>
                                    <p
                                        className={`text-sm ${storeStatusColor}`}
                                    >
                                        • {storeStatus}
                                    </p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className='flex flex-col items-start gap-3'>
                                {store.hasCreds ? (
                                    <Attendants store={store} />
                                ) : (
                                    <ConnectStore
                                        storeId={store.id}
                                        connectionUrl={store.connectionUrl}
                                    />
                                )}
                                <div className='flex gap-2'>
                                    <SyncContacts store={store.id} />
                                    <Button
                                        className='text-red-400'
                                        variant='outline'
                                        onClick={() => setOpen(true)}
                                        disabled={hasAttendants}
                                    >
                                        <Trash /> Excluir loja
                                    </Button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </CardContent>
            </Card>
            <RemoveStore
                open={open}
                setOpen={setOpen}
                storeId={store.id}
            />
        </>
    )
}
