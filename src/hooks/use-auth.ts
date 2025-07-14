import { auth } from '@/firebase'
import { BASE_URL } from '@/globals'
import axios from 'axios'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    type AuthError,
} from 'firebase/auth'

type LoginParams = {
    email: string
    password: string
}

type SigninParams = {
    name: string
    email: string
    password: string
}

export const useAuth = () => {
    const login = ({ email, password }: LoginParams) => {
        return new Promise((resolve, reject) => {
            signInWithEmailAndPassword(auth, email, password)
                .then((creds) => resolve(creds.user))
                .catch((error) => {
                    const err = error as AuthError
                    reject(err.code)
                })
        })
    }

    const signin = ({ name, email, password }: SigninParams) => {
        return new Promise((resolve, reject) => {
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (creds) => {
                    const user = creds.user
                    await updateProfile(user, { displayName: name })
                    await axios.post(`${BASE_URL}/users`, {
                        uid: user.uid,
                        name,
                        email,
                    })
                    resolve({ ...user, displayName: name })
                })
                .catch((error) => {
                    const err = error as AuthError
                    reject(err.code)
                })
        })
    }

    return { login, signin }
}
