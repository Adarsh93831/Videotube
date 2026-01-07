import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { FaEye, FaClock } from 'react-icons/fa'

const VideoCard = ({ video }) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views?.toString() || '0'
  }

  return (
    <Link to={`/video/${video._id}`} className="group block card-hover">
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-dark-800">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs font-medium">
          {formatDuration(video.duration)}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="flex gap-3 mt-3">
        {/* Channel Avatar */}
        <Link 
          to={`/channel/${video.owner?.username}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0"
        >
          <img
            src={video.owner?.avatar || '/default-avatar.png'}
            alt={video.owner?.username}
            className="w-9 h-9 rounded-full object-cover hover:ring-2 hover:ring-primary-500 transition-all"
          />
        </Link>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-medium text-white line-clamp-2 group-hover:text-primary-400 transition-colors">
            {video.title}
          </h3>

          {/* Channel Name */}
          <Link 
            to={`/channel/${video.owner?.username}`}
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-dark-400 hover:text-white transition-colors mt-1 block"
          >
            {video.owner?.username}
          </Link>

          {/* Stats */}
          <div className="flex items-center gap-2 text-sm text-dark-400 mt-1">
            <span className="flex items-center gap-1">
              <FaEye className="text-xs" />
              {formatViews(video.views)} views
            </span>
            <span>•</span>
            <span>
              {video.createdAt && formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default VideoCard
