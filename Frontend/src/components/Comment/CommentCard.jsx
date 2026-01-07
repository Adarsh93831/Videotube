import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { FaThumbsUp, FaEdit, FaTrash } from 'react-icons/fa'
import useAuthStore from '../../store/authStore'
import useCommentStore from '../../store/commentStore'
import useLikeStore from '../../store/likeStore'
import toast from 'react-hot-toast'

const CommentCard = ({ comment, videoId }) => {
  const { user } = useAuthStore()
  const { updateComment, deleteComment } = useCommentStore()
  const { toggleCommentLike } = useLikeStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isLiked, setIsLiked] = useState(comment.isLiked || false)
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0)

  const isOwner = user?._id === comment.owner?._id

  const handleUpdate = async () => {
    if (!editContent.trim()) return
    try {
      await updateComment(comment._id, editContent)
      setIsEditing(false)
      toast.success('Comment updated')
    } catch (error) {
      toast.error('Failed to update comment')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await deleteComment(comment._id)
      toast.success('Comment deleted')
    } catch (error) {
      toast.error('Failed to delete comment')
    }
  }

  const handleLike = async () => {
    try {
      await toggleCommentLike(comment._id)
      setIsLiked(!isLiked)
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
    } catch (error) {
      toast.error('Failed to like comment')
    }
  }

  return (
    <div className="flex gap-3 group">
      <img
        src={comment.owner?.avatar || '/default-avatar.png'}
        alt={comment.owner?.username}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">@{comment.owner?.username}</span>
          <span className="text-xs text-dark-400">
            {comment.createdAt && formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>

        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 resize-none"
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-1.5 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm font-medium transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditContent(comment.content)
                }}
                className="px-4 py-1.5 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-dark-200 mt-1">{comment.content}</p>
            
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 text-sm ${
                  isLiked ? 'text-primary-500' : 'text-dark-400 hover:text-white'
                } transition-colors`}
              >
                <FaThumbsUp className="text-xs" />
                <span>{likesCount}</span>
              </button>

              {isOwner && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-dark-400 hover:text-white transition-colors"
                  >
                    <FaEdit className="text-sm" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1 text-dark-400 hover:text-red-500 transition-colors"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CommentCard
