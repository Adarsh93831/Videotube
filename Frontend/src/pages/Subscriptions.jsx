import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MdSubscriptions } from 'react-icons/md'
import useSubscriptionStore from '../store/subscriptionStore'

const Subscriptions = () => {
  const { subscribedChannels, isLoading, fetchMySubscribedChannels } = useSubscriptionStore()

  useEffect(() => {
    fetchMySubscribedChannels()
  }, [fetchMySubscribedChannels])

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count?.toString() || '0'
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-dark-800 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="w-24 h-24 rounded-full bg-dark-800 mx-auto mb-2"></div>
              <div className="h-4 bg-dark-800 rounded w-20 mx-auto mb-1"></div>
              <div className="h-3 bg-dark-800 rounded w-16 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <MdSubscriptions className="text-2xl text-primary-500" />
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <span className="text-dark-400">({subscribedChannels.length} channels)</span>
      </div>

      {subscribedChannels.length === 0 ? (
        <div className="text-center py-20">
          <MdSubscriptions className="text-6xl text-dark-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-dark-400 mb-2">No subscriptions</h2>
          <p className="text-dark-500">Channels you subscribe to will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {subscribedChannels.map((sub) => {
            const channel = sub.channel || sub
            return (
              <Link
                key={channel._id}
                to={`/channel/${channel.username}`}
                className="text-center group"
              >
                <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary-500 transition-all">
                  <img
                    src={channel.avatar}
                    alt={channel.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                  {channel.username}
                </h3>
                <p className="text-sm text-dark-400">
                  {formatCount(channel.subscribersCount)} subscribers
                </p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Subscriptions
