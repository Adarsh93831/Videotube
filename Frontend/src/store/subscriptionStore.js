import { create } from 'zustand'
import { subscriptionAPI } from '../api'

const useSubscriptionStore = create((set, get) => ({
  subscribers: [],
  subscribedChannels: [],
  isLoading: false,
  error: null,

  toggleSubscription: async (channelId) => {
    try {
      const response = await subscriptionAPI.toggleSubscription(channelId)
      return response.data
    } catch (error) {
      throw error
    }
  },

  fetchMySubscribers: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await subscriptionAPI.getMySubscribers()
      set({ subscribers: response.data.data || [], isLoading: false })
      return response.data
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch subscribers' 
      })
      throw error
    }
  },

  fetchMySubscribedChannels: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await subscriptionAPI.getMySubscribedChannels()
      set({ subscribedChannels: response.data.data || [], isLoading: false })
      return response.data
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch subscribed channels' 
      })
      throw error
    }
  },

  clearSubscriptions: () => set({ subscribers: [], subscribedChannels: [] }),
  clearError: () => set({ error: null }),
}))

export default useSubscriptionStore
