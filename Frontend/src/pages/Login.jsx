import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaPlay, FaEye, FaEyeSlash } from 'react-icons/fa'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await login(formData)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="animate-fadeIn">
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
          <FaPlay className="text-white text-xl ml-1" />
        </div>
        <span className="text-2xl font-bold text-white">VideoTube</span>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
      <p className="text-dark-400 mb-8">Sign in to continue to VideoTube</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Email or Username
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email or username"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="input-field pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-dark-600 text-primary-600 focus:ring-primary-500 bg-dark-800"
            />
            <span className="text-sm text-dark-300">Remember me</span>
          </label>
          
          <Link
            to="/forgot-password"
            className="text-sm text-primary-500 hover:text-primary-400 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <p className="text-center text-dark-400 mt-8">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-primary-500 hover:text-primary-400 font-medium transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default Login
