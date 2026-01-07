import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './store/authStore'

// Layout
import Layout from './components/Layout/Layout'
import AuthLayout from './components/Layout/AuthLayout'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VideoPlayer from './pages/VideoPlayer'
import Upload from './pages/Upload'
import Channel from './pages/Channel'
import Search from './pages/Search'
import History from './pages/History'
import LikedVideos from './pages/LikedVideos'
import Subscriptions from './pages/Subscriptions'
import Playlists from './pages/Playlists'
import PlaylistDetail from './pages/PlaylistDetail'
import Settings from './pages/Settings'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

// Components
import ProtectedRoute from './components/Auth/ProtectedRoute'

function App() {
  const { getCurrentUser, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser()
    }
  }, [isAuthenticated, getCurrentUser])

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* Main Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/video/:videoId" element={<VideoPlayer />} />
        <Route path="/channel/:username" element={<Channel />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/upload" element={<Upload />} />
          <Route path="/history" element={<History />} />
          <Route path="/liked-videos" element={<LikedVideos />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
