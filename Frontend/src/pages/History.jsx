import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaHistory, FaTrash } from 'react-icons/fa'
import { formatDistanceToNow } from 'date-fns'
import { userAPI } from '../api'
import toast from 'react-hot-toast'

const History = () => {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await userAPI.getWatchHistory()
        setHistory(response.data.data || [])
      } catch (error) {
        toast.error('Failed to load watch history')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-64 aspect-video bg-dark-800 rounded-xl"></div>
            <div className="flex-1">
              <div className="h-5 bg-dark-800 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-dark-800 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-dark-800 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaHistory className="text-2xl text-primary-500" />
          <h1 className="text-2xl font-bold">Watch History</h1>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20">
          <FaHistory className="text-6xl text-dark-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-dark-400 mb-2">No watch history</h2>
          <p className="text-dark-500">Videos you watch will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((video) => (
            <Link
              key={video._id}
              to={`/video/${video._id}`}
              className="flex gap-4 group hover:bg-dark-800/50 rounded-xl p-2 -mx-2 transition-colors"
            >
              <div className="relative w-48 md:w-64 aspect-video rounded-xl overflow-hidden bg-dark-800 flex-shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs font-medium">
                  {formatDuration(video.duration)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-lg line-clamp-2 group-hover:text-primary-400 transition-colors">
                  {video.title}
                </h3>
                <p className="text-dark-400 text-sm mt-1">
                  {video.owner?.username}
                </p>
                <p className="text-dark-500 text-sm mt-1">
                  {video.views} views • {video.createdAt && formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                </p>
                <p className="text-dark-400 text-sm mt-2 line-clamp-2">
                  {video.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default History
