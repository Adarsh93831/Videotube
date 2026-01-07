const VideoCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Thumbnail */}
      <div className="aspect-video rounded-xl bg-dark-800 skeleton"></div>

      {/* Video Info */}
      <div className="flex gap-3 mt-3">
        {/* Channel Avatar */}
        <div className="w-9 h-9 rounded-full bg-dark-700 skeleton flex-shrink-0"></div>

        <div className="flex-1">
          {/* Title */}
          <div className="h-4 bg-dark-700 skeleton rounded w-full mb-2"></div>
          <div className="h-4 bg-dark-700 skeleton rounded w-3/4 mb-2"></div>

          {/* Channel Name */}
          <div className="h-3 bg-dark-700 skeleton rounded w-1/2 mb-2"></div>

          {/* Stats */}
          <div className="h-3 bg-dark-700 skeleton rounded w-2/3"></div>
        </div>
      </div>
    </div>
  )
}

export default VideoCardSkeleton
