import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaPlay, FaEye, FaEyeSlash, FaCamera } from 'react-icons/fa'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const Register = () => {
  const navigate = useNavigate()
  const { register, isLoading, error, clearError } = useAuthStore()
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) clearError()
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverImage(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!avatar) {
      toast.error('Avatar is required')
      return
    }

    const submitData = new FormData()
    submitData.append('fullName', formData.fullName)
    submitData.append('username', formData.username)
    submitData.append('email', formData.email)
    submitData.append('password', formData.password)
    submitData.append('avatar', avatar)
    if (coverImage) {
      submitData.append('coverImage', coverImage)
    }

    try {
      await register(submitData)
      toast.success('Account created successfully! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
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

      <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
      <p className="text-dark-400 mb-8">Join the community today</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Avatar Upload */}
        <div className="flex justify-center mb-6">
          <label className="relative cursor-pointer group">
            <div className="w-24 h-24 rounded-full bg-dark-700 border-2 border-dashed border-dark-500 flex items-center justify-center overflow-hidden group-hover:border-primary-500 transition-colors">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <FaCamera className="text-2xl text-dark-400 group-hover:text-primary-500 transition-colors" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center border-2 border-dark-950">
              <FaCamera className="text-xs text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
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
              placeholder="Create a strong password"
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
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Cover Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="w-full text-sm text-dark-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-dark-700 file:text-white hover:file:bg-dark-600 cursor-pointer"
          />
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
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <p className="text-center text-dark-400 mt-8">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-primary-500 hover:text-primary-400 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default Register
