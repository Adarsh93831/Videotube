import { create } from 'zustand'
import { videoAPI } from '../api'

const useVideoStore = create((set, get) => ({
  videos: [],
  currentVideo: null,
  totalVideos: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,

  fetchVideos: async (params = {}) => {
    set({ isLoading: true, error: null })
    try {
      const response = await videoAPI.getAllVideos(params)
      const { videos, totalVideos, page, totalPages } = response.data.data
      set({ 
        videos, 
        totalVideos, 
        currentPage: page, 
        totalPages,
        isLoading: false 
      })
      return response.data
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch videos' 
      })
      throw error
    }
  },

  fetchMoreVideos: async (params = {}) => {
    const { currentPage, videos } = get()
    set({ isLoading: true })
    try {
      const response = await videoAPI.getAllVideos({ ...params, page: currentPage + 1 })
      const { videos: newVideos, totalVideos, page, totalPages } = response.data.data
      set({ 
        videos: [...videos, ...newVideos], 
        totalVideos, 
        currentPage: page, 
        totalPages,
        isLoading: false 
      })
      return response.data
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  fetchVideoById: async (videoId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await videoAPI.getVideoById(videoId)
      set({ currentVideo: response.data.data, isLoading: false })
      return response.data
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch video' 
      })
      throw error
    }
  },

  publishVideo: async (formData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await videoAPI.publishVideo(formData)
      const newVideo = response.data.data
      set((state) => ({ 
        videos: [newVideo, ...state.videos], 
        isLoading: false 
      }))
      return response.data
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to publish video' 
      })
      throw error
    }
  },

  updateVideo: async (videoId, formData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await videoAPI.updateVideo(videoId, formData)
      const updatedVideo = response.data.data
      set((state) => ({ 
        videos: state.videos.map(v => v._id === videoId ? updatedVideo : v),
        currentVideo: state.currentVideo?._id === videoId ? updatedVideo : state.currentVideo,
        isLoading: false 
      }))
      return response.data
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to update video' 
      })
      throw error
    }
  },

  deleteVideo: async (videoId) => {
    set({ isLoading: true, error: null })
    try {
      await videoAPI.deleteVideo(videoId)
      set((state) => ({ 
        videos: state.videos.filter(v => v._id !== videoId),
        isLoading: false 
      }))
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to delete video' 
      })
      throw error
    }
  },

  togglePublishStatus: async (videoId) => {
    try {
      const response = await videoAPI.togglePublishStatus(videoId)
      const updatedVideo = response.data.data
      set((state) => ({ 
        videos: state.videos.map(v => v._id === videoId ? updatedVideo : v),
        currentVideo: state.currentVideo?._id === videoId ? updatedVideo : state.currentVideo,
      }))
      return response.data
    } catch (error) {
      throw error
    }
  },

  clearCurrentVideo: () => set({ currentVideo: null }),
  clearVideos: () => set({ videos: [], totalVideos: 0, currentPage: 1, totalPages: 1 }),
  clearError: () => set({ error: null }),
}))

export default useVideoStore
