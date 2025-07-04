import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.models.js";
import Video from "../models/video.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// ✅ Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password"); // hide passwords
  res.status(200).json(new ApiResponse(200, users));
});

// ✅ Delete a user
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");

  await user.deleteOne();
  res.status(200).json(new ApiResponse(200, "User deleted successfully"));
});

// ✅ Get all videos
export const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find().populate("owner", "username email");
  res.status(200).json(new ApiResponse(200, videos));
});

// ✅ Delete a video
export const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) throw new ApiError(404, "Video not found");

  await video.deleteOne();
  res.status(200).json(new ApiResponse(200, "Video deleted successfully"));
});

// ✅ Get Analytics (example)
export const getAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalVideos = await Video.countDocuments();
  res.status(200).json(
    new ApiResponse(200, {
      totalUsers,
      totalVideos,
    })
  );
});


export{
    getAllUsers,
    deleteUser,
    getAllVideos,
    deleteVideo,
    getAnalytics
}
