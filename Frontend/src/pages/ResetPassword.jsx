import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FaPlay, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa'
import { authAPI } from '../api'
import toast from 'react-hot-toast'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      await authAPI.resetPassword(token, password)
      setIsSuccess(true)
      toast.success('Password reset successfully')
      setTimeout(() => navigate('/login'), 3000)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="animate-fadeIn text-center">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle className="text-3xl text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Password reset!</h1>
        <p className="text-dark-400 mb-8">
          Your password has been successfully reset. Redirecting to login...
        </p>
        <Link
          to="/login"
          className="text-primary-500 hover:text-primary-400 font-medium transition-colors"
        >
          Go to login
        </Link>
      </div>
    )
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

      <h1 className="text-3xl font-bold text-white mb-2">Reset password</h1>
      <p className="text-dark-400 mb-8">
        Enter your new password below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="input-field pr-12"
              required
              minLength={6}
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

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="input-field"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Resetting...
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </div>
  )
}

export default ResetPassword
