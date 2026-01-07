import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { FaPlay } from 'react-icons/fa'

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <FaPlay className="text-primary-600 text-xl ml-1" />
          </div>
          <span className="text-3xl font-bold text-white">VideoTube</span>
        </Link>
        
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Share Your Stories with the World
          </h1>
          <p className="text-primary-100 text-lg">
            Upload, share, and discover amazing video content. Join millions of creators 
            and viewers on VideoTube today.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex-1">
            <h3 className="text-2xl font-bold text-white">10M+</h3>
            <p className="text-primary-100 text-sm">Active Users</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex-1">
            <h3 className="text-2xl font-bold text-white">5M+</h3>
            <p className="text-primary-100 text-sm">Videos Uploaded</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex-1">
            <h3 className="text-2xl font-bold text-white">100K+</h3>
            <p className="text-primary-100 text-sm">Creators</p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
