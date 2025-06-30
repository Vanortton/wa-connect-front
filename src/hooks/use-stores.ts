import axios from 'axios'

export const useStores = () => {
    const getStores = async (userToken: string) => {
        const response = await axios.get(
            'http://localhost:3000/stores',
            {
                params: { idToken: userToken },
            }
        )
        const stores = response.data.stores
        return stores
    }

    const createStore = async (userToken: string, surname: string) => {
        await axios.post(
            'http://localhost:3000/stores',
            {
                idToken: userToken,
                surname,
            }
        )
        return
    }

    const deleteStore = async (userToken: string, storeId: string) => {
        await axios.delete(
            `http://localhost:3000/store/${storeId}`,
            {
                params: { idToken: userToken },
            }
        )
        return
    }

    const createStoreAttendant = async (
        userToken: string,
        storeId: string,
        name: string
    ) => {
        await axios.post(
            `http://localhost:3000/store/${storeId}/attendants`,
            {
                idToken: userToken,
                name,
            }
        )
        return
    }

    const deleteStoreAttendant = async (
        userToken: string,
        storeId: string,
        token: string
    ) => {
        await axios.delete(
            `http://localhost:3000/store/${storeId}/attendants/${token}`,
            { params: { idToken: userToken } }
        )
        return
    }

    return {
        getStores,
        createStore,
        deleteStore,
        createStoreAttendant,
        deleteStoreAttendant,
    }
}
