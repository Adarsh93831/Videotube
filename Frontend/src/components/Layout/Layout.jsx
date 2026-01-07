import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import useUIStore from '../../store/uiStore'

const Layout = () => {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main 
          className={`flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-20'
          }`}
        >
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
