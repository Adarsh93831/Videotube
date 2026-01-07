import { create } from 'zustand'
import { commentAPI } from '../api'

const useCommentStore = create((set, get) => ({
  comments: [],
  isLoading: false,
  error: null,

  fetchComments: async (videoId, params = {}) => {
    set({ isLoading: true, error: null })
    try {
      const response = await commentAPI.getVideoComments(videoId, params)
      set({ comments: response.data.data || [], isLoading: false })
      return response.data
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch comments' 
      })
      throw error
    }
  },

  addComment: async (videoId, content) => {
    set({ isLoading: true, error: null })
    try {
      const response = await commentAPI.addComment(videoId, content)
      const newComment = response.data.data
      set((state) => ({ 
        comments: [newComment, ...state.comments], 
        isLoading: false 
      }))
      return response.data
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to add comment' 
      })
      throw error
    }
  },

  updateComment: async (commentId, content) => {
    set({ isLoading: true, error: null })
    try {
      const response = await commentAPI.updateComment(commentId, content)
      const updatedComment = response.data.data
      set((state) => ({ 
        comments: state.comments.map(c => c._id === commentId ? updatedComment : c),
        isLoading: false 
      }))
      return response.data
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to update comment' 
      })
      throw error
    }
  },

  deleteComment: async (commentId) => {
    set({ isLoading: true, error: null })
    try {
      await commentAPI.deleteComment(commentId)
      set((state) => ({ 
        comments: state.comments.filter(c => c._id !== commentId),
        isLoading: false 
      }))
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to delete comment' 
      })
      throw error
    }
  },

  clearComments: () => set({ comments: [] }),
  clearError: () => set({ error: null }),
}))

export default useCommentStore
