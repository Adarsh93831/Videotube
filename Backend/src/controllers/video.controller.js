import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


// can also be used get all videos for channel
const publishAVideo=asyncHandler(async(req,res)=>{
     const {title,description}=req.body;
     if(!title || !description)
     {
        throw new ApiError(400,"Title and description are required");
     }
     
   
     

     const videoFileLocalPath=req.files?.videoFile?.[0]?.path
     const thumbnailLocalPath=req.files?.thumbnail?.[0]?.path



     if(!videoFileLocalPath || !thumbnailLocalPath){
        throw new ApiError(400,"Video file and thumbnail are required")
     }
     

     const uploadedVideo=await uploadOnCloudinary(videoFileLocalPath);
     const uplaodedThumbnail=await uploadOnCloudinary(thumbnailLocalPath);

     if(!uploadedVideo?.secure_url || !uplaodedThumbnail?.secure_url)
     {
        throw new ApiError(500,"Error uploading files to cloudinary")
     }

     
     

     const duration =Math.floor(uploadedVideo.duration || 0);

     const video=await Video.create({
            videoFile:uploadedVideo.secure_url,
            thumbnail:uplaodedThumbnail.secure_url,
            title,
            description,
            duration,
            owner:req.user._id,

        });
        console.log("Hello5");

    res
    .status(201)
    .json(
        new ApiResponse(201,video,"Video uploaded and published successfully")
    )
 });

const getAllVideos=asyncHandler(async(req,res)=>{
        let {page=1 , limit=10, query="",sortBy="createdAt",sortType="desc",userId}=req.query;
        page=parseInt(page);
        limit=parseInt(limit);

       
        
        

        const filters={
            isPublished:true,
        }

        if(query)
        {
            filters.title={$regex:query, $options:"i"};
        }

        
        
        if(userId)
        {
            // Convert userId string to ObjectId
            // filters.owner = new mongoose.Types.ObjectId(userId);
            filters.owner = userId;
        }

      
        

        const sortOptions={};
        if(sortType=="asc") sortOptions[sortBy]=1;
        else sortOptions[sortBy]=-1;

        
        

        const videos=await Video.find(filters)
            .sort(sortOptions)
            .skip((page-1)*limit)
            .limit(limit)
            .populate({
                path:"owner",
                select:"username avatar",
            });

            
            

            const totalVideos=await Video.countDocuments(filters);

            res
            .status(200)
            .json(new ApiResponse(
                200,{
                    videos,
                    totalVideos,
                    page,
                    totalPages:Math.ceil(totalVideos/limit),
                },
                "Videos fetched Successfully"
            ))
});

const getVideoById=asyncHandler(async(req,res)=>{
        const {videoId} = req.params;

        const video=await Video.findById(videoId).populate({
            path:"owner",
            select:"username avatar"
        });

        if(!video)
        {
            throw new ApiError(404,"Video not found");
        }

        video.views=video.views+1;
        await video.save({validateBeforeSave: false });

        // Add video to watchHistory if not already present (or update as desired)
        if(req.user) {
            const user = req.user;
            // Prevent duplicate entries:
            if(!user.watchHistory.includes(video._id)) {
                user.watchHistory.push(video._id);
                await user.save({ validateBeforeSave: false });
            }
        }

        return res.status(200).json(
            new ApiResponse(200,video,"Video fetched successfully")
        );
});


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    // Find the video
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Authorization: Check if the logged-in user is the owner of the video
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }

    // ✅ Update title & description if provided
    if (title) video.title = title;
    if (description) video.description = description;

    // ✅ If thumbnail is provided → upload to Cloudinary
    if (req.file) {
        const thumbnailUpload = await uploadOnCloudinary(req.file.path);
        video.thumbnail = thumbnailUpload.secure_url;
    }

    await video.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
      const { videoId } = req.params;

    // Find the video by ID
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Authorization → Check if logged-in user is the owner of the video
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video");
    }

    // ✅ Delete the video document
    await video.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, "Video deleted successfully")
    );
});
    

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Authorization → Only owner can toggle
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }

    // ✅ Toggle the isPublished value
    video.isPublished = !video.isPublished;

    await video.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, video, `Video is now ${video.isPublished ? "published" : "unpublished"}`)
    );
});

 export{
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo
 }