import { useState, useEffect } from 'react'
import useAuthStore from '../../store/authStore'
import useCommentStore from '../../store/commentStore'
import CommentCard from './CommentCard'
import toast from 'react-hot-toast'

const CommentSection = ({ videoId }) => {
  const { user, isAuthenticated } = useAuthStore()
  const { comments, isLoading, fetchComments, addComment } = useCommentStore()
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (videoId) {
      fetchComments(videoId)
    }
  }, [videoId, fetchComments])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      await addComment(videoId, newComment)
      setNewComment('')
      toast.success('Comment added')
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">
        {comments.length} Comment{comments.length !== 1 ? 's' : ''}
      </h3>

      {/* Add Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <img
            src={user?.avatar || '/default-avatar.png'}
            alt={user?.username}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-2 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 resize-none transition-colors"
              rows={3}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setNewComment('')}
                className="px-4 py-2 text-dark-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-dark-400 mb-6">
          Please <a href="/login" className="text-primary-500 hover:underline">sign in</a> to comment.
        </p>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-dark-700"></div>
              <div className="flex-1">
                <div className="h-4 bg-dark-700 rounded w-32 mb-2"></div>
                <div className="h-3 bg-dark-700 rounded w-full mb-1"></div>
                <div className="h-3 bg-dark-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentCard key={comment._id} comment={comment} videoId={videoId} />
          ))}
        </div>
      ) : (
        <p className="text-dark-400 text-center py-8">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  )
}

export default CommentSection
