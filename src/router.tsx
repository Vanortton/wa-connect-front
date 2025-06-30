import { createHashRouter, Navigate } from 'react-router-dom'
import Admin from './components/admin/Admin'
import Stores from './components/admin/pages/Stores/Stores'
import AdminLayout from './components/AdminLayout'
import Auth from './components/auth/Auth'
import Login from './components/auth/forms/Login'
import Signin from './components/auth/forms/Signin'
import Chats from './components/chats/Chats'
import Connect from './components/connect/Connect'
import Landing from './components/landing/Landing'
import RootLayout from './components/RootLayout'
import { ChatsProvider } from './contexts/ChatsContext'

const router = createHashRouter([
    {
        path: '*',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <Landing />,
            },
            {
                path: 'connect',
                element: (
                    <ChatsProvider>
                        <Connect />
                    </ChatsProvider>
                ),
            },
            {
                path: 'conversations',
                element: (
                    <ChatsProvider>
                        <Chats />
                    </ChatsProvider>
                ),
            },
        ],
    },
    {
        path: '/',
        element: <AdminLayout />,
        children: [
            {
                path: 'auth',
                element: <Auth />,
                children: [
                    {
                        index: true,
                        element: <Login />,
                    },
                    {
                        path: 'signin',
                        element: <Signin />,
                    },
                ],
            },
            {
                path: 'admin',
                element: <Admin />,
                children: [
                    {
                        index: true,
                        element: <Navigate to='stores' />,
                    },
                    {
                        path: 'stores',
                        element: <Stores />,
                    },
                ],
            },
            {
                path: '*',
                element: <div>Not found</div>,
            },
        ],
    },
])

export default router
