import { NavLink } from 'react-router-dom'
import { 
  FaHome, 
  FaFire, 
  FaPlayCircle,
  FaHistory, 
  FaThumbsUp, 
  FaList,
  FaClock,
  FaCog
} from 'react-icons/fa'
import { MdSubscriptions } from 'react-icons/md'
import useUIStore from '../../store/uiStore'
import useAuthStore from '../../store/authStore'

const Sidebar = () => {
  const { sidebarOpen } = useUIStore()
  const { isAuthenticated } = useAuthStore()

  const mainLinks = [
    { to: '/', icon: FaHome, label: 'Home' },
    { to: '/trending', icon: FaFire, label: 'Trending' },
    { to: '/subscriptions', icon: MdSubscriptions, label: 'Subscriptions', protected: true },
  ]

  const libraryLinks = [
    { to: '/history', icon: FaHistory, label: 'History', protected: true },
    { to: '/playlists', icon: FaList, label: 'Playlists', protected: true },
    { to: '/liked-videos', icon: FaThumbsUp, label: 'Liked Videos', protected: true },
  ]

  const NavItem = ({ to, icon: Icon, label, protected: isProtected }) => {
    if (isProtected && !isAuthenticated) return null

    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive
              ? 'bg-dark-700 text-white'
              : 'text-dark-300 hover:bg-dark-800 hover:text-white'
          }`
        }
      >
        <Icon className="text-xl flex-shrink-0" />
        {sidebarOpen && <span className="font-medium">{label}</span>}
      </NavLink>
    )
  }

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-dark-900 border-r border-dark-700 transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex flex-col h-full p-3 overflow-y-auto no-scrollbar">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainLinks.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </div>

        {/* Divider */}
        {isAuthenticated && (
          <>
            <div className="my-4 border-t border-dark-700"></div>

            {/* Library */}
            {sidebarOpen && (
              <h3 className="px-4 py-2 text-sm font-semibold text-dark-400 uppercase tracking-wider">
                Library
              </h3>
            )}
            <div className="space-y-1">
              {libraryLinks.map((link) => (
                <NavItem key={link.to} {...link} />
              ))}
            </div>
          </>
        )}

        {/* Settings at bottom */}
        <div className="mt-auto pt-4 border-t border-dark-700">
          <NavItem to="/settings" icon={FaCog} label="Settings" protected />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
