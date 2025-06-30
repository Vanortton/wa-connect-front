import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { StoresContext } from '@/contexts/StoresContext'
import { UserContext } from '@/contexts/UserContext'
import { Plus } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import Loading from '../../elements/Loading'
import PageHeader from '../../elements/PageHeader'
import CreateStore from './elements/CreateStore'
import StoreItem from './elements/StoreItem'

export default function Stores() {
    const [open, setOpen] = useState<boolean>(false)
    const { user } = useContext(UserContext)
    const { stores, loading, fetchStores } = useContext(StoresContext)

    useEffect(() => {
        if (user && user.token && !open) fetchStores(user)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, open])

    if (loading) return <Loading message='Carregando as lojas' />
    return (
        <>
            <PageHeader title='Gerenciar lojas e conexões' />
            <div className='mb-4' />
            <Button onClick={() => setOpen(true)}>
                <Plus /> Adicionar loja
            </Button>
            <CreateStore
                open={open}
                setOpen={setOpen}
            />
            <div className='mb-4' />
            {stores.length ? (
                <Accordion
                    className='flex flex-col gap-3'
                    type='multiple'
                >
                    {stores.map((store, index) => (
                        <StoreItem
                            store={store}
                            index={index}
                            key={index}
                        />
                    ))}
                </Accordion>
            ) : (
                <div className='flex flex-col items-center w-full mt-16'>
                    <h1 className='text-xl'>Nenhum loja cadastrada</h1>
                </div>
            )}
        </>
    )
}
