import VideoCard from './VideoCard'
import VideoCardSkeleton from './VideoCardSkeleton'

const VideoGrid = ({ videos, isLoading, emptyMessage = 'No videos found' }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mb-4">
          <svg 
            className="w-12 h-12 text-dark-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
            />
          </svg>
        </div>
        <p className="text-dark-400 text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  )
}

export default VideoGrid
