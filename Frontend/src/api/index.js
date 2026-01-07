import api from './axios'

// Auth APIs
export const authAPI = {
  register: (formData) => api.post('/users/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  login: (data) => api.post('/users/login', data),
  logout: () => api.post('/users/logout'),
  refreshToken: () => api.post('/users/refresh-token'),
  getCurrentUser: () => api.get('/users/current-user'),
  forgotPassword: (email) => api.post('/users/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/users/reset-password/${token}`, { password }),
}

// User APIs
export const userAPI = {
  updateAccount: (data) => api.patch('/users/update-account', data),
  updateAvatar: (formData) => api.patch('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateCoverImage: (formData) => api.patch('/users/cover-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  changePassword: (data) => api.post('/users/change-password', data),
  getChannelProfile: (username) => api.get(`/users/c/${username}`),
  getWatchHistory: () => api.get('/users/history'),
}

// Video APIs
export const videoAPI = {
  getAllVideos: (params) => api.get('/videos', { params }),
  getVideoById: (videoId) => api.get(`/videos/${videoId}`),
  publishVideo: (formData) => api.post('/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateVideo: (videoId, formData) => api.patch(`/videos/${videoId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteVideo: (videoId) => api.delete(`/videos/${videoId}`),
  togglePublishStatus: (videoId) => api.patch(`/videos/toggle/publish/${videoId}`),
}

// Comment APIs
export const commentAPI = {
  getVideoComments: (videoId, params) => api.get(`/comments/${videoId}`, { params }),
  addComment: (videoId, content) => api.post(`/comments/${videoId}`, { content }),
  updateComment: (commentId, content) => api.patch(`/comments/c/${commentId}`, { content }),
  deleteComment: (commentId) => api.delete(`/comments/c/${commentId}`),
}

// Like APIs
export const likeAPI = {
  toggleVideoLike: (videoId) => api.post(`/likes/toggle/v/${videoId}`),
  toggleCommentLike: (commentId) => api.post(`/likes/toggle/c/${commentId}`),
  getLikedVideos: () => api.get('/likes/videos'),
}

// Subscription APIs
export const subscriptionAPI = {
  toggleSubscription: (channelId) => api.post(`/subscriptions/c/${channelId}`),
  getMySubscribers: () => api.get('/subscriptions/getMySubscribers'),
  getMySubscribedChannels: () => api.get('/subscriptions/getMySubscribedChannels'),
}

// Playlist APIs
export const playlistAPI = {
  createPlaylist: (data) => api.post('/playlists', data),
  getMyPlaylists: () => api.get('/playlists'),
  getUserPlaylists: (userId) => api.get(`/playlists/user/${userId}`),
  getPlaylistById: (playlistId) => api.get(`/playlists/${playlistId}`),
  updatePlaylist: (playlistId, data) => api.patch(`/playlists/${playlistId}`, data),
  deletePlaylist: (playlistId) => api.delete(`/playlists/${playlistId}`),
  addVideoToPlaylist: (videoId, playlistId) => api.patch(`/playlists/add/${videoId}/${playlistId}`),
  removeVideoFromPlaylist: (videoId, playlistId) => api.patch(`/playlists/remove/${videoId}/${playlistId}`),
}

export default api
