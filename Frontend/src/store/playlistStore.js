import { create } from 'zustand'
import { playlistAPI } from '../api'

const usePlaylistStore = create((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,

  fetchMyPlaylists: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await playlistAPI.getMyPlaylists()
      set({ playlists: response.data.data || [], isLoading: false })
      return response.data
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch playlists' 
      })
      throw error
    }
  },

  fetchUserPlaylists: async (userId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await playlistAPI.getUserPlaylists(userId)
      set({ playlists: response.data.data || [], isLoading: false })
      return response.data
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch playlists' 
      })
      throw error
    }
  },

  fetchPlaylistById: async (playlistId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await playlistAPI.getPlaylistById(playlistId)
      set({ currentPlaylist: response.data.data, isLoading: false })
      return response.data
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch playlist' 
      })
      throw error
    }
  },

  createPlaylist: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await playlistAPI.createPlaylist(data)
      const newPlaylist = response.data.data
      set((state) => ({ 
        playlists: [newPlaylist, ...state.playlists], 
        isLoading: false 
      }))
      return response.data
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to create playlist' 
      })
      throw error
    }
  },

  updatePlaylist: async (playlistId, data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await playlistAPI.updatePlaylist(playlistId, data)
      const updatedPlaylist = response.data.data
      set((state) => ({ 
        playlists: state.playlists.map(p => p._id === playlistId ? updatedPlaylist : p),
        currentPlaylist: state.currentPlaylist?._id === playlistId ? updatedPlaylist : state.currentPlaylist,
        isLoading: false 
      }))
      return response.data
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to update playlist' 
      })
      throw error
    }
  },

  deletePlaylist: async (playlistId) => {
    set({ isLoading: true, error: null })
    try {
      await playlistAPI.deletePlaylist(playlistId)
      set((state) => ({ 
        playlists: state.playlists.filter(p => p._id !== playlistId),
        isLoading: false 
      }))
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to delete playlist' 
      })
      throw error
    }
  },

  addVideoToPlaylist: async (videoId, playlistId) => {
    try {
      const response = await playlistAPI.addVideoToPlaylist(videoId, playlistId)
      return response.data
    } catch (error) {
      throw error
    }
  },

  removeVideoFromPlaylist: async (videoId, playlistId) => {
    try {
      const response = await playlistAPI.removeVideoFromPlaylist(videoId, playlistId)
      // Update current playlist if viewing it
      set((state) => {
        if (state.currentPlaylist?._id === playlistId) {
          return {
            currentPlaylist: {
              ...state.currentPlaylist,
              videos: state.currentPlaylist.videos.filter(v => v._id !== videoId)
            }
          }
        }
        return state
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  clearCurrentPlaylist: () => set({ currentPlaylist: null }),
  clearPlaylists: () => set({ playlists: [] }),
  clearError: () => set({ error: null }),
}))

export default usePlaylistStore
