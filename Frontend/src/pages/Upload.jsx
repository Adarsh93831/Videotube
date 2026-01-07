import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCloudUploadAlt, FaVideo, FaImage, FaTimes } from 'react-icons/fa'
import useVideoStore from '../store/videoStore'
import toast from 'react-hot-toast'

const Upload = () => {
  const navigate = useNavigate()
  const { publishVideo, isLoading } = useVideoStore()
  
  const videoInputRef = useRef(null)
  const thumbnailInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })
  const [videoFile, setVideoFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideoFile(file)
      setVideoPreview(URL.createObjectURL(file))
    }
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnail(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!videoFile || !thumbnail) {
      toast.error('Please upload both video and thumbnail')
      return
    }

    const data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('videoFile', videoFile)
    data.append('thumbnail', thumbnail)

    try {
      await publishVideo(data)
      toast.success('Video uploaded successfully!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload video')
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <h1 className="text-3xl font-bold mb-8">Upload Video</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video Upload */}
        <div className="bg-dark-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaVideo className="text-primary-500" />
            Video File
          </h2>
          
          {!videoPreview ? (
            <div
              onClick={() => videoInputRef.current?.click()}
              className="border-2 border-dashed border-dark-600 rounded-xl p-12 text-center cursor-pointer hover:border-primary-500 transition-colors"
            >
              <FaCloudUploadAlt className="text-5xl text-dark-400 mx-auto mb-4" />
              <p className="text-dark-300 mb-2">Drag and drop or click to upload</p>
              <p className="text-sm text-dark-500">MP4, WebM, MKV (Max 500MB)</p>
            </div>
          ) : (
            <div className="relative">
              <video
                src={videoPreview}
                className="w-full aspect-video rounded-xl object-cover"
                controls
              />
              <button
                type="button"
                onClick={() => {
                  setVideoFile(null)
                  setVideoPreview(null)
                }}
                className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          )}
          
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="hidden"
          />
        </div>

        {/* Thumbnail Upload */}
        <div className="bg-dark-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaImage className="text-primary-500" />
            Thumbnail
          </h2>
          
          {!thumbnailPreview ? (
            <div
              onClick={() => thumbnailInputRef.current?.click()}
              className="border-2 border-dashed border-dark-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
            >
              <FaImage className="text-4xl text-dark-400 mx-auto mb-4" />
              <p className="text-dark-300 mb-2">Upload thumbnail</p>
              <p className="text-sm text-dark-500">JPG, PNG (16:9 ratio recommended)</p>
            </div>
          ) : (
            <div className="relative inline-block">
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="w-64 aspect-video rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setThumbnail(null)
                  setThumbnailPreview(null)
                }}
                className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          )}
          
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="hidden"
          />
        </div>

        {/* Video Details */}
        <div className="bg-dark-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Video Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter a catchy title for your video"
                className="input-field"
                required
                maxLength={100}
              />
              <p className="text-xs text-dark-500 mt-1">{formData.title.length}/100</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell viewers about your video"
                className="input-field resize-none"
                rows={5}
                required
                maxLength={5000}
              />
              <p className="text-xs text-dark-500 mt-1">{formData.description.length}/5000</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-dark-700 hover:bg-dark-600 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !videoFile || !thumbnail}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 disabled:cursor-not-allowed rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                <FaCloudUploadAlt />
                Publish Video
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Upload
