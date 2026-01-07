import { useState, useRef } from 'react'
import { FaCog, FaCamera, FaUser, FaLock, FaImage } from 'react-icons/fa'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const Settings = () => {
  const { user, updateAccount, updateAvatar, updateCoverImage, changePassword, isLoading } = useAuthStore()
  
  const avatarInputRef = useRef(null)
  const coverInputRef = useRef(null)
  
  const [activeTab, setActiveTab] = useState('profile')
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try {
      await updateAccount(profileData)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })
      toast.success('Password changed successfully')
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      await updateAvatar(formData)
      toast.success('Avatar updated successfully')
    } catch (error) {
      toast.error('Failed to update avatar')
    }
  }

  const handleCoverChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('coverImage', file)

    try {
      await updateCoverImage(formData)
      toast.success('Cover image updated successfully')
    } catch (error) {
      toast.error('Failed to update cover image')
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="flex items-center gap-3 mb-8">
        <FaCog className="text-2xl text-primary-500" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Cover Image */}
      <div className="relative h-48 rounded-xl overflow-hidden bg-dark-800 mb-16">
        {user?.coverImage && (
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <button
          onClick={() => coverInputRef.current?.click()}
          className="absolute bottom-4 right-4 px-4 py-2 bg-black/60 hover:bg-black/80 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaImage />
          Change Cover
        </button>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
          className="hidden"
        />

        {/* Avatar */}
        <div className="absolute -bottom-12 left-6">
          <div className="relative">
            <img
              src={user?.avatar || '/default-avatar.png'}
              alt={user?.username}
              className="w-28 h-28 rounded-full object-cover border-4 border-dark-950"
            />
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center transition-colors border-2 border-dark-950"
            >
              <FaCamera className="text-sm" />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-dark-700 mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 px-2 font-medium transition-colors relative flex items-center gap-2 ${
            activeTab === 'profile' ? 'text-white' : 'text-dark-400 hover:text-white'
          }`}
        >
          <FaUser />
          Profile
          {activeTab === 'profile' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`pb-4 px-2 font-medium transition-colors relative flex items-center gap-2 ${
            activeTab === 'password' ? 'text-white' : 'text-dark-400 hover:text-white'
          }`}
        >
          <FaLock />
          Password
          {activeTab === 'password' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
          )}
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="bg-dark-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={user?.username || ''}
                  disabled
                  className="input-field bg-dark-700 cursor-not-allowed opacity-60"
                />
                <p className="text-xs text-dark-500 mt-1">Username cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 rounded-xl font-medium transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="bg-dark-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="input-field"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 rounded-xl font-medium transition-colors"
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Settings
