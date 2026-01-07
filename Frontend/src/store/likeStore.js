import { create } from 'zustand'
import { likeAPI } from '../api'

const useLikeStore = create((set, get) => ({
  likedVideos: [],
  isLoading: false,
  error: null,

  toggleVideoLike: async (videoId) => {
    try {
      const response = await likeAPI.toggleVideoLike(videoId)
      return response.data
    } catch (error) {
      throw error
    }
  },

  toggleCommentLike: async (commentId) => {
    try {
      const response = await likeAPI.toggleCommentLike(commentId)
      return response.data
    } catch (error) {
      throw error
    }
  },

  fetchLikedVideos: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await likeAPI.getLikedVideos()
      set({ likedVideos: response.data.data || [], isLoading: false })
      return response.data
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch liked videos' 
      })
      throw error
    }
  },

  clearLikedVideos: () => set({ likedVideos: [] }),
  clearError: () => set({ error: null }),
}))

export default useLikeStore
