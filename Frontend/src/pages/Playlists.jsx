import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaList, FaPlus, FaTrash, FaEdit, FaPlay } from 'react-icons/fa'
import usePlaylistStore from '../store/playlistStore'
import toast from 'react-hot-toast'

const Playlists = () => {
  const { playlists, isLoading, fetchMyPlaylists, createPlaylist, deletePlaylist } = usePlaylistStore()
  const [showModal, setShowModal] = useState(false)
  const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' })
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchMyPlaylists()
  }, [fetchMyPlaylists])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newPlaylist.name.trim()) return

    setIsCreating(true)
    try {
      await createPlaylist(newPlaylist)
      toast.success('Playlist created')
      setShowModal(false)
      setNewPlaylist({ name: '', description: '' })
    } catch (error) {
      toast.error('Failed to create playlist')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (playlistId, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!window.confirm('Delete this playlist?')) return
    
    try {
      await deletePlaylist(playlistId)
      toast.success('Playlist deleted')
    } catch (error) {
      toast.error('Failed to delete playlist')
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-dark-800 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="aspect-video bg-dark-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaList className="text-2xl text-primary-500" />
          <h1 className="text-2xl font-bold">Playlists</h1>
          <span className="text-dark-400">({playlists.length})</span>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
        >
          <FaPlus />
          New Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-20">
          <FaList className="text-6xl text-dark-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-dark-400 mb-2">No playlists yet</h2>
          <p className="text-dark-500 mb-4">Create a playlist to organize your videos</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl font-medium transition-colors"
          >
            Create Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((playlist) => (
            <Link
              key={playlist._id}
              to={`/playlist/${playlist._id}`}
              className="group relative bg-dark-800 rounded-xl overflow-hidden card-hover"
            >
              <div className="aspect-video bg-dark-700 relative">
                {playlist.videos?.[0]?.thumbnail ? (
                  <img
                    src={playlist.videos[0].thumbnail}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaList className="text-4xl text-dark-500" />
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <FaPlay className="text-white ml-1" />
                  </div>
                </div>

                {/* Video Count */}
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                  <FaList className="text-xs" />
                  {playlist.videos?.length || 0} videos
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                      {playlist.name}
                    </h3>
                    {playlist.description && (
                      <p className="text-sm text-dark-400 mt-1 line-clamp-2">
                        {playlist.description}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={(e) => handleDelete(playlist._id, e)}
                    className="p-2 text-dark-400 hover:text-red-500 transition-colors"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4">Create Playlist</h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={newPlaylist.name}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                  placeholder="Enter playlist name"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newPlaylist.description}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                  placeholder="Enter description (optional)"
                  className="input-field resize-none"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 rounded-lg font-medium transition-colors"
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Playlists
