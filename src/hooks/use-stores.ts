import axios from 'axios'

export const useStores = () => {
    const getStores = async (userToken: string) => {
        const response = await axios.get(
            'https://backend-779792751824.us-central1.run.app/stores',
            {
                params: { idToken: userToken },
            }
        )
        const stores = response.data.stores
        return stores
    }

    const createStore = async (userToken: string, surname: string) => {
        await axios.post(
            'https://backend-779792751824.us-central1.run.app/stores',
            {
                idToken: userToken,
                surname,
            }
        )
        return
    }

    const deleteStore = async (userToken: string, storeId: string) => {
        await axios.delete(
            `https://backend-779792751824.us-central1.run.app/store/${storeId}`,
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
            `https://backend-779792751824.us-central1.run.app/store/${storeId}/attendants`,
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
            `https://backend-779792751824.us-central1.run.app/store/${storeId}/attendants/${token}`,
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
