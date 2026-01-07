import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FaPlay, 
  FaBars, 
  FaSearch, 
  FaBell, 
  FaPlus,
  FaUser,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa'
import useAuthStore from '../../store/authStore'
import useUIStore from '../../store/uiStore'

const Navbar = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { toggleSidebar, searchQuery, setSearchQuery } = useUIStore()
  const [showDropdown, setShowDropdown] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchQuery)

  const handleSearch = (e) => {
    e.preventDefault()
    if (localSearch.trim()) {
      setSearchQuery(localSearch)
      navigate(`/search?q=${encodeURIComponent(localSearch)}`)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    setShowDropdown(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-dark-900 border-b border-dark-700 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-dark-700 rounded-full transition-colors"
          >
            <FaBars className="text-xl text-dark-200" />
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <FaPlay className="text-white text-sm ml-0.5" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">VideoTube</span>
          </Link>
        </div>

        {/* Center Section - Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
          <div className="relative flex">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search videos..."
              className="w-full bg-dark-800 border border-dark-600 rounded-l-full px-4 py-2 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors"
            />
            <button
              type="submit"
              className="bg-dark-700 hover:bg-dark-600 px-6 rounded-r-full border border-l-0 border-dark-600 transition-colors"
            >
              <FaSearch className="text-dark-300" />
            </button>
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/upload"
                className="flex items-center gap-2 bg-dark-700 hover:bg-dark-600 px-4 py-2 rounded-full transition-colors"
              >
                <FaPlus className="text-primary-500" />
                <span className="hidden sm:block text-sm font-medium">Upload</span>
              </Link>

              <button className="p-2 hover:bg-dark-700 rounded-full transition-colors relative">
                <FaBell className="text-xl text-dark-200" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-primary-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-primary-500 transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-dark-600 flex items-center justify-center">
                      <FaUser className="text-dark-300" />
                    </div>
                  )}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-dark-800 rounded-xl shadow-xl border border-dark-700 py-2 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-dark-700">
                      <p className="font-medium text-white">{user?.fullName}</p>
                      <p className="text-sm text-dark-400">@{user?.username}</p>
                    </div>
                    
                    <Link
                      to={`/channel/${user?.username}`}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-dark-700 transition-colors"
                    >
                      <FaUser className="text-dark-400" />
                      <span>Your Channel</span>
                    </Link>
                    
                    <Link
                      to="/settings"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-dark-700 transition-colors"
                    >
                      <FaCog className="text-dark-400" />
                      <span>Settings</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-dark-700 transition-colors text-left"
                    >
                      <FaSignOutAlt className="text-dark-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-full transition-colors"
            >
              <FaUser className="text-sm" />
              <span className="font-medium">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
