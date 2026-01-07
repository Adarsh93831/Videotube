import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaCheck, FaVideo, FaUsers, FaEye } from 'react-icons/fa'
import { userAPI, videoAPI } from '../api'
import useAuthStore from '../store/authStore'
import useSubscriptionStore from '../store/subscriptionStore'
import VideoGrid from '../components/Video/VideoGrid'
import toast from 'react-hot-toast'

const Channel = () => {
  const { username } = useParams()
  const { user, isAuthenticated } = useAuthStore()
  const { toggleSubscription } = useSubscriptionStore()
  
  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('videos')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscribersCount, setSubscribersCount] = useState(0)

  useEffect(() => {
    const fetchChannelData = async () => {
      setIsLoading(true)
      try {
        const [channelRes, videosRes] = await Promise.all([
          userAPI.getChannelProfile(username),
          videoAPI.getAllVideos({ userId: undefined }) // We'll filter by username
        ])
        
        setChannel(channelRes.data.data)
        setIsSubscribed(channelRes.data.data.isSubscribed || false)
        setSubscribersCount(channelRes.data.data.subscribersCount || 0)
        
        // Fetch videos by channel owner
        const channelVideos = await videoAPI.getAllVideos({ userId: channelRes.data.data._id })
        setVideos(channelVideos.data.data.videos || [])
      } catch (error) {
        toast.error('Failed to load channel')
      } finally {
        setIsLoading(false)
      }
    }

    fetchChannelData()
  }, [username])

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to subscribe')
      return
    }
    try {
      await toggleSubscription(channel._id)
      setIsSubscribed(!isSubscribed)
      setSubscribersCount(isSubscribed ? subscribersCount - 1 : subscribersCount + 1)
      toast.success(isSubscribed ? 'Unsubscribed' : 'Subscribed!')
    } catch (error) {
      toast.error('Failed to subscribe')
    }
  }

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count?.toString() || '0'
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-48 bg-dark-800 rounded-xl mb-4"></div>
        <div className="flex gap-4 items-end -mt-16 mb-6">
          <div className="w-32 h-32 rounded-full bg-dark-700 border-4 border-dark-950"></div>
          <div className="flex-1 pb-4">
            <div className="h-8 bg-dark-700 rounded w-48 mb-2"></div>
            <div className="h-4 bg-dark-700 rounded w-32"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-dark-400">Channel not found</h2>
      </div>
    )
  }

  const isOwnChannel = user?._id === channel._id

  return (
    <div className="animate-fadeIn">
      {/* Cover Image */}
      <div className="h-48 md:h-64 rounded-xl overflow-hidden bg-dark-800">
        {channel.coverImage && (
          <img
            src={channel.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Channel Info */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end -mt-16 mb-6 px-4">
        <img
          src={channel.avatar}
          alt={channel.username}
          className="w-32 h-32 rounded-full object-cover border-4 border-dark-950"
        />
        
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{channel.fullName}</h1>
          <p className="text-dark-400">@{channel.username}</p>
          
          <div className="flex items-center gap-4 mt-2 text-dark-400 text-sm">
            <span className="flex items-center gap-1">
              <FaUsers />
              {formatCount(subscribersCount)} subscribers
            </span>
            <span className="flex items-center gap-1">
              <FaVideo />
              {videos.length} videos
            </span>
          </div>
        </div>

        {!isOwnChannel && (
          <button
            onClick={handleSubscribe}
            className={`px-6 py-2.5 rounded-full font-medium transition-all ${
              isSubscribed
                ? 'bg-dark-700 text-white hover:bg-dark-600'
                : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            {isSubscribed ? (
              <span className="flex items-center gap-2">
                <FaCheck /> Subscribed
              </span>
            ) : (
              'Subscribe'
            )}
          </button>
        )}

        {isOwnChannel && (
          <Link
            to="/settings"
            className="px-6 py-2.5 bg-dark-700 hover:bg-dark-600 rounded-full font-medium transition-colors"
          >
            Edit Channel
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-dark-700 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-4 px-2 font-medium transition-colors relative ${
              activeTab === 'videos' ? 'text-white' : 'text-dark-400 hover:text-white'
            }`}
          >
            Videos
            {activeTab === 'videos' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className={`pb-4 px-2 font-medium transition-colors relative ${
              activeTab === 'playlists' ? 'text-white' : 'text-dark-400 hover:text-white'
            }`}
          >
            Playlists
            {activeTab === 'playlists' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-4 px-2 font-medium transition-colors relative ${
              activeTab === 'about' ? 'text-white' : 'text-dark-400 hover:text-white'
            }`}
          >
            About
            {activeTab === 'about' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'videos' && (
        <VideoGrid 
          videos={videos} 
          isLoading={false} 
          emptyMessage="This channel has no videos yet"
        />
      )}

      {activeTab === 'playlists' && (
        <div className="text-center py-12 text-dark-400">
          No playlists available
        </div>
      )}

      {activeTab === 'about' && (
        <div className="max-w-2xl bg-dark-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">About</h3>
          <p className="text-dark-300">
            {channel.description || 'This channel has no description.'}
          </p>
          
          <div className="mt-6 pt-6 border-t border-dark-700">
            <h4 className="font-medium mb-4">Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-700 rounded-lg p-4">
                <p className="text-2xl font-bold">{formatCount(subscribersCount)}</p>
                <p className="text-sm text-dark-400">Subscribers</p>
              </div>
              <div className="bg-dark-700 rounded-lg p-4">
                <p className="text-2xl font-bold">{videos.length}</p>
                <p className="text-sm text-dark-400">Videos</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Channel
