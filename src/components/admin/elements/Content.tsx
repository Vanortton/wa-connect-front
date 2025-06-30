import { Outlet } from 'react-router'

export default function Content() {
    return (
        <div className='p-6 w-full'>
            <Outlet />
        </div>
    )
}
