import mongoose from "mongoose"
import {Comment} from "../models/comment.models.js"
import { Video } from "../models/video.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    
    let {page = 1, limit = 10} = req.query

    page=parseInt(page);
    limit=parseInt(limit);

    if(!videoId)
    {
        throw new ApiError(400,"Video ID is required");
    }

    const comments=await Comment.find({video:videoId}).populate({
        path:"owner",
        select:"username avatar"
    })
    .sort({createdAt:-1})
    .skip((page-1)*limit)
    .limit(limit);

    const totalComments=await Comment.countDocuments({video:videoId});

    return res.status(200).json(
        new ApiResponse(200,
            {
                comments,
                totalComments,
                page,
                totalPages:Math.ceil(totalComments/limit),
            },
            "comments fetched successfully"
        )
    );

  
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Comment content is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  const populatedComment = await comment.populate({
    path: "owner",
    select: "username avatar",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, populatedComment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    const {commentId}=req.params;
    const {content} =req.body;

    if(!content){
      throw new ApiError(400,"Content is required to update the comment");
    }

    const existingComment=await Comment.findById(commentId);

    if(!existingComment){
      throw new ApiError(404,"Comment not found. ");
    }

    if(existingComment.owner.toString() !== req.user._id.toString()){
      throw new ApiError(403,"You are not allowed to update this comment");
    }

    existingComment.content=content;
    await existingComment.save();

    const updatedComment=await existingComment.populate({
      path:"owner",
      select:"username avatar",
    });

    return res.status(200).json(
      new ApiResponse(200,updatedComment,"Comment updated successfully")
    );

})

const deleteComment = asyncHandler(async (req, res) => {
   const { commentId } = req.params;

    const existingComment = await Comment.findById(commentId);

    if (!existingComment) {
        throw new ApiError(404, "Comment not found.");
    }

    // Only the owner of the comment can delete it
    if (existingComment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this comment.");
    }

    await existingComment.deleteOne();
    return res.status(200).json(
        new ApiResponse(200, null, "Comment deleted successfully.")
    );
});


export{
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}