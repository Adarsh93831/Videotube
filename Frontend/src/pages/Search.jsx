import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaFilter } from 'react-icons/fa'
import useVideoStore from '../store/videoStore'
import VideoGrid from '../components/Video/VideoGrid'

const Search = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { videos, isLoading, fetchVideos } = useVideoStore()
  
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortType, setSortType] = useState('desc')

  useEffect(() => {
    if (query) {
      fetchVideos({ query, sortBy, sortType })
    }
  }, [query, sortBy, sortType, fetchVideos])

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Search Results</h1>
          {query && (
            <p className="text-dark-400 mt-1">
              Showing results for "{query}"
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-dark-800 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
          >
            <option value="createdAt">Date</option>
            <option value="views">Views</option>
            <option value="title">Title</option>
          </select>

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="bg-dark-800 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      <VideoGrid 
        videos={videos} 
        isLoading={isLoading}
        emptyMessage={query ? `No results found for "${query}"` : 'Start searching for videos'}
      />
    </div>
  )
}

export default Search
