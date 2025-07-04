import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {Video} from "../models/video.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Comment} from "../models/comment.models.js"



const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if(!isValidObjectId(videoId))
    {
        throw new ApiError(404,"Invalid Video id");
    }

    const video=await Video.findById(videoId);

    if(!video) throw new ApiError(404,"Video not found");

    const existingLike=await Like.findOne({
        video:videoId,
        likedBy:req.user._id,
    })

    if(existingLike){
        await existingLike.deleteOne();
        return res
            .status(200)
            .json(new ApiResponse(200,{},"Video unliked Successfully"))
    }
    else{
         await Like.create({
            video: videoId,
            likedBy: req.user._id,
        });

        return res
            .status(201)
            .json(new ApiResponse(200,{},"Video liked Successfully"))
    }
});


const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    // Validate commentId
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // Check if comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Check if the user already liked this comment
    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id,
    });

    if (existingLike) {
        // Already liked → remove like (toggle off)
        await existingLike.deleteOne();
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Like removed from comment"));
    } else {
        // Not liked yet → add new like
        await Like.create({
            comment: commentId,
            likedBy: req.user._id,
        });

        return res
            .status(201)
            .json(new ApiResponse(201, {}, "Comment liked successfully"));
    }
});


const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos=await Like.find({
        video: { $ne:null },
        likedBy:req.user._id,
    }).populate({
        path:"video",
        populate:{
            path:"owner",
            select:"username fullname avatar"
        },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});


export{
    toggleVideoLike,
    toggleCommentLike,
    getLikedVideos
}