import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI, userAPI } from '../api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAccessToken: (token) => set({ accessToken: token }),

      register: async (formData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authAPI.register(formData)
          set({ isLoading: false })
          return response.data
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Registration failed' 
          })
          throw error
        }
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authAPI.login(credentials)
          const { user, accessToken, refreshToken } = response.data.data
          set({ 
            user, 
            accessToken,
            isAuthenticated: true, 
            isLoading: false 
          })
          return response.data
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Login failed' 
          })
          throw error
        }
      },

      logout: async () => {
        try {
          await authAPI.logout()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({ 
            user: null, 
            accessToken: null,
            isAuthenticated: false 
          })
        }
      },

      getCurrentUser: async () => {
        if (!get().accessToken) return
        
        set({ isLoading: true })
        try {
          const response = await authAPI.getCurrentUser()
          set({ user: response.data.data, isLoading: false })
          return response.data
        } catch (error) {
          set({ isLoading: false })
          if (error.response?.status === 401) {
            get().logout()
          }
          throw error
        }
      },

      updateAccount: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await userAPI.updateAccount(data)
          set({ user: response.data.data, isLoading: false })
          return response.data
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Update failed' 
          })
          throw error
        }
      },

      updateAvatar: async (formData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await userAPI.updateAvatar(formData)
          set({ user: response.data.data, isLoading: false })
          return response.data
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Avatar update failed' 
          })
          throw error
        }
      },

      updateCoverImage: async (formData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await userAPI.updateCoverImage(formData)
          set({ user: response.data.data, isLoading: false })
          return response.data
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Cover image update failed' 
          })
          throw error
        }
      },

      changePassword: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await userAPI.changePassword(data)
          set({ isLoading: false })
          return response.data
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Password change failed' 
          })
          throw error
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)

export default useAuthStore
