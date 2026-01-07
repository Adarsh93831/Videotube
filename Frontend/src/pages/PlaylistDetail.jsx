import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaPlay, FaTrash, FaArrowLeft } from 'react-icons/fa'
import { formatDistanceToNow } from 'date-fns'
import usePlaylistStore from '../store/playlistStore'
import toast from 'react-hot-toast'

const PlaylistDetail = () => {
  const { playlistId } = useParams()
  const { currentPlaylist, isLoading, fetchPlaylistById, removeVideoFromPlaylist } = usePlaylistStore()

  useEffect(() => {
    fetchPlaylistById(playlistId)
  }, [playlistId, fetchPlaylistById])

  const handleRemoveVideo = async (videoId, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await removeVideoFromPlaylist(videoId, playlistId)
      toast.success('Video removed from playlist')
    } catch (error) {
      toast.error('Failed to remove video')
    }
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isLoading || !currentPlaylist) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-dark-800 rounded w-48 mb-2"></div>
        <div className="h-4 bg-dark-800 rounded w-32 mb-6"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-48 aspect-video bg-dark-800 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-5 bg-dark-800 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-dark-800 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <Link
        to="/playlists"
        className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-4"
      >
        <FaArrowLeft />
        Back to Playlists
      </Link>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Playlist Cover */}
        <div className="md:w-80 flex-shrink-0">
          <div className="aspect-video bg-dark-800 rounded-xl overflow-hidden relative">
            {currentPlaylist.videos?.[0]?.thumbnail ? (
              <img
                src={currentPlaylist.videos[0].thumbnail}
                alt={currentPlaylist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-dark-500">
                No videos
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-sm text-dark-300">{currentPlaylist.videos?.length || 0} videos</p>
            </div>
          </div>

          {currentPlaylist.videos?.length > 0 && (
            <Link
              to={`/video/${currentPlaylist.videos[0]._id}`}
              className="flex items-center justify-center gap-2 w-full mt-4 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <FaPlay />
              Play All
            </Link>
          )}
        </div>

        {/* Playlist Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{currentPlaylist.name}</h1>
          {currentPlaylist.description && (
            <p className="text-dark-400 mb-4">{currentPlaylist.description}</p>
          )}
          <p className="text-sm text-dark-500">
            Created {currentPlaylist.createdAt && formatDistanceToNow(new Date(currentPlaylist.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Videos List */}
      {currentPlaylist.videos?.length === 0 ? (
        <div className="text-center py-12 text-dark-400">
          This playlist is empty
        </div>
      ) : (
        <div className="space-y-4">
          {currentPlaylist.videos?.map((video, index) => (
            <Link
              key={video._id}
              to={`/video/${video._id}`}
              className="flex gap-4 group hover:bg-dark-800/50 rounded-xl p-2 -mx-2 transition-colors"
            >
              <span className="text-dark-500 font-medium w-6 text-center pt-4">
                {index + 1}
              </span>
              
              <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-dark-800 flex-shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-xs font-medium">
                  {formatDuration(video.duration)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium line-clamp-2 group-hover:text-primary-400 transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-dark-400 mt-1">
                  {video.owner?.username}
                </p>
                <p className="text-xs text-dark-500 mt-1">
                  {video.views} views
                </p>
              </div>

              <button
                onClick={(e) => handleRemoveVideo(video._id, e)}
                className="p-2 text-dark-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <FaTrash />
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default PlaylistDetail
