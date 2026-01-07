import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaPlay, FaEnvelope } from 'react-icons/fa'
import { authAPI } from '../api'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authAPI.forgotPassword(email)
      setIsSubmitted(true)
      toast.success('Reset link sent to your email')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="animate-fadeIn text-center">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaEnvelope className="text-3xl text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Check your email</h1>
        <p className="text-dark-400 mb-8">
          We've sent a password reset link to <span className="text-white">{email}</span>
        </p>
        <Link
          to="/login"
          className="text-primary-500 hover:text-primary-400 font-medium transition-colors"
        >
          Back to login
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

      <h1 className="text-3xl font-bold text-white mb-2">Forgot password?</h1>
      <p className="text-dark-400 mb-8">
        No worries, we'll send you reset instructions.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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
              Sending...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <p className="text-center text-dark-400 mt-8">
        <Link
          to="/login"
          className="text-primary-500 hover:text-primary-400 font-medium transition-colors"
        >
          ← Back to login
        </Link>
      </p>
    </div>
  )
}

export default ForgotPassword
