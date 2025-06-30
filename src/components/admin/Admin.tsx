import { SidebarProvider } from '../ui/sidebar'
import Content from './elements/Content'
import Sidebar from './elements/Sidebar'

export default function Admin() {
    return (
        <div className='h-screen'>
            <SidebarProvider>
                <Sidebar />
                <Content />
            </SidebarProvider>
        </div>
    )
}
