import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactPlayer from 'react-player'
import { formatDistanceToNow } from 'date-fns'
import { 
  FaThumbsUp, 
  FaShare, 
  FaBookmark, 
  FaEllipsisH,
  FaEye,
  FaPlus,
  FaCheck
} from 'react-icons/fa'
import useVideoStore from '../store/videoStore'
import useAuthStore from '../store/authStore'
import useLikeStore from '../store/likeStore'
import useSubscriptionStore from '../store/subscriptionStore'
import usePlaylistStore from '../store/playlistStore'
import CommentSection from '../components/Comment/CommentSection'
import VideoGrid from '../components/Video/VideoGrid'
import toast from 'react-hot-toast'

const VideoPlayer = () => {
  const { videoId } = useParams()
  const { currentVideo, isLoading, fetchVideoById, videos, fetchVideos } = useVideoStore()
  const { isAuthenticated, user } = useAuthStore()
  const { toggleVideoLike } = useLikeStore()
  const { toggleSubscription } = useSubscriptionStore()
  const { playlists, fetchMyPlaylists, addVideoToPlaylist } = usePlaylistStore()
  
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscribersCount, setSubscribersCount] = useState(0)
  const [showPlaylistModal, setShowPlaylistModal] = useState(false)
  const [isDescExpanded, setIsDescExpanded] = useState(false)

  useEffect(() => {
    fetchVideoById(videoId)
    fetchVideos({ limit: 8 })
  }, [videoId, fetchVideoById, fetchVideos])

  useEffect(() => {
    if (currentVideo) {
      setIsLiked(currentVideo.isLiked || false)
      setLikesCount(currentVideo.likesCount || 0)
      setIsSubscribed(currentVideo.owner?.isSubscribed || false)
      setSubscribersCount(currentVideo.owner?.subscribersCount || 0)
    }
  }, [currentVideo])

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyPlaylists()
    }
  }, [isAuthenticated, fetchMyPlaylists])

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like videos')
      return
    }
    try {
      await toggleVideoLike(videoId)
      setIsLiked(!isLiked)
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
    } catch (error) {
      toast.error('Failed to like video')
    }
  }

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to subscribe')
      return
    }
    try {
      await toggleSubscription(currentVideo.owner._id)
      setIsSubscribed(!isSubscribed)
      setSubscribersCount(isSubscribed ? subscribersCount - 1 : subscribersCount + 1)
      toast.success(isSubscribed ? 'Unsubscribed' : 'Subscribed!')
    } catch (error) {
      toast.error('Failed to subscribe')
    }
  }

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await addVideoToPlaylist(videoId, playlistId)
      toast.success('Added to playlist')
      setShowPlaylistModal(false)
    } catch (error) {
      toast.error('Failed to add to playlist')
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard')
  }

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views?.toString() || '0'
  }

  if (isLoading || !currentVideo) {
    return (
      <div className="animate-pulse">
        <div className="aspect-video bg-dark-800 rounded-xl mb-4"></div>
        <div className="h-8 bg-dark-800 rounded w-3/4 mb-4"></div>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-dark-800"></div>
          <div className="flex-1">
            <div className="h-4 bg-dark-800 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-dark-800 rounded w-1/6"></div>
          </div>
        </div>
      </div>
    )
  }

  const suggestedVideos = videos.filter(v => v._id !== videoId).slice(0, 8)

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden">
            <ReactPlayer
              url={currentVideo.videoFile}
              width="100%"
              height="100%"
              controls
              playing
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload'
                  }
                }
              }}
            />
          </div>

          {/* Video Info */}
          <div className="mt-4">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              {currentVideo.title}
            </h1>

            {/* Actions Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
              {/* Channel Info */}
              <div className="flex items-center gap-4">
                <Link to={`/channel/${currentVideo.owner?.username}`}>
                  <img
                    src={currentVideo.owner?.avatar}
                    alt={currentVideo.owner?.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </Link>
                <div>
                  <Link 
                    to={`/channel/${currentVideo.owner?.username}`}
                    className="font-semibold text-white hover:text-primary-400 transition-colors"
                  >
                    {currentVideo.owner?.username}
                  </Link>
                  <p className="text-sm text-dark-400">
                    {formatViews(subscribersCount)} subscribers
                  </p>
                </div>
                
                {user?._id !== currentVideo.owner?._id && (
                  <button
                    onClick={handleSubscribe}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
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
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    isLiked
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-700 text-white hover:bg-dark-600'
                  }`}
                >
                  <FaThumbsUp />
                  <span>{formatViews(likesCount)}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-dark-700 text-white rounded-full hover:bg-dark-600 transition-colors"
                >
                  <FaShare />
                  <span>Share</span>
                </button>

                <button
                  onClick={() => setShowPlaylistModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-dark-700 text-white rounded-full hover:bg-dark-600 transition-colors"
                >
                  <FaBookmark />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 bg-dark-800 rounded-xl p-4">
              <div className="flex items-center gap-4 text-sm text-dark-300 mb-2">
                <span className="flex items-center gap-1">
                  <FaEye />
                  {formatViews(currentVideo.views)} views
                </span>
                <span>
                  {currentVideo.createdAt && formatDistanceToNow(new Date(currentVideo.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className={`text-dark-200 whitespace-pre-wrap ${!isDescExpanded && 'line-clamp-3'}`}>
                {currentVideo.description}
              </p>
              {currentVideo.description?.length > 150 && (
                <button
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="text-primary-500 hover:text-primary-400 text-sm font-medium mt-2"
                >
                  {isDescExpanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>

            {/* Comments */}
            <CommentSection videoId={videoId} />
          </div>
        </div>

        {/* Suggested Videos Sidebar */}
        <div className="xl:w-96">
          <h3 className="text-lg font-semibold mb-4">Suggested Videos</h3>
          <div className="space-y-4">
            {suggestedVideos.map((video) => (
              <Link
                key={video._id}
                to={`/video/${video._id}`}
                className="flex gap-3 group"
              >
                <div className="w-40 aspect-video rounded-lg overflow-hidden bg-dark-800 flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary-400 transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-xs text-dark-400 mt-1">{video.owner?.username}</p>
                  <p className="text-xs text-dark-400">
                    {formatViews(video.views)} views • {video.createdAt && formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Playlist Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowPlaylistModal(false)}>
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4">Save to playlist</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {playlists.map((playlist) => (
                <button
                  key={playlist._id}
                  onClick={() => handleAddToPlaylist(playlist._id)}
                  className="w-full flex items-center gap-3 p-3 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors text-left"
                >
                  <FaPlus className="text-dark-400" />
                  <span>{playlist.name}</span>
                </button>
              ))}
              {playlists.length === 0 && (
                <p className="text-dark-400 text-center py-4">No playlists yet</p>
              )}
            </div>
            <button
              onClick={() => setShowPlaylistModal(false)}
              className="w-full mt-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer
