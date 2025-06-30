import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: 'AIzaSyC0hVLhV4RjwqCdXAMKZX9mMrpYeEGh-aM',
    authDomain: 'vazap-sync.firebaseapp.com',
    projectId: 'vazap-sync',
    storageBucket: 'vazap-sync.firebasestorage.app',
    messagingSenderId: '545375085918',
    appId: '1:545375085918:web:2a4c06f9e1023fc4075bcf',
    measurementId: 'G-HDHGW9SLQ6',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { auth, db }
