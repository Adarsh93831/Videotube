import { useEffect, useState } from 'react'
import useVideoStore from '../store/videoStore'
import VideoGrid from '../components/Video/VideoGrid'

const categories = [
  'All', 'Music', 'Gaming', 'News', 'Sports', 'Entertainment', 
  'Education', 'Technology', 'Comedy', 'Vlogs', 'Travel'
]

const Home = () => {
  const { videos, isLoading, fetchVideos, totalPages, currentPage, fetchMoreVideos } = useVideoStore()
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    fetchVideos({ limit: 12 })
  }, [fetchVideos])

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchMoreVideos({ limit: 12 })
    }
  }

  return (
    <div className="animate-fadeIn">
      {/* Category Pills */}
      <div className="mb-6 -mx-4 px-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-white text-black'
                  : 'bg-dark-800 text-white hover:bg-dark-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <VideoGrid videos={videos} isLoading={isLoading} />

      {/* Load More Button */}
      {!isLoading && currentPage < totalPages && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-dark-700 hover:bg-dark-600 rounded-xl font-medium transition-colors"
          >
            Load More Videos
          </button>
        </div>
      )}
    </div>
  )
}

export default Home
