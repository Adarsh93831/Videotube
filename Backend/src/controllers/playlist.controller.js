import mongoose,{isValidObjectId} from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.models.js"
import { User } from "../models/user.models.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!name || !description) throw new ApiError(400,"Playlist name is required");
       
   
    
    const playlist=await Playlist.create({
        name,
        description,
        owner:req.user._id,
    });

    return res.status(201).json(new ApiResponse(201,playlist,"playlist created successfully"))
});

const getMyPlaylists = asyncHandler(async (req, res) => {
    const playlists = await Playlist.find({ owner: req.user._id }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "User playlists fetched successfully"));
});

//will be used at channel dashboard
const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
      
      
      if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }
     
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

 const playlists = await Playlist.find({ owner: userId }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "User playlists fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

     if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist=await Playlist.findById(playlistId)
        .populate({
            path:"videos",
            populate:{
                path:"owner",
                select:"username fullname avtar",
            },
        })
        .populate({
            path:"owner",
            select:"username fullName avatar",
        });

        if(!playlist)
        {
            throw new ApiError(404,"Playlist not found");

        }

        return res
            .status(200)
            .json(new ApiResponse(200,playlist,"Playlist fetched successfully"));

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
        if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist ID or video ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    
     if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to modify this playlist");
    }


    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if(playlist.videos.includes(videoId))
    {
        throw new ApiError(400,"Video is already in the playlist")
    }

    playlist.videos.push(videoId);
    await playlist.save();

    return res
        .status(200)
        .json(new ApiResponse(200,playlist,"Video added to playlist successfully"));

});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

        if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist ID or video ID");
    }

     const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

     if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to modify this playlist");
    }

    if(!playlist.videos.includes(videoId))
    {
        throw new ApiError(400,"Video not found in playlist")
    }


    const updatedPlaylist=await Playlist.findByIdAndUpdate(
        playlistId,
        {$pull: {videos:videoId}},
        {new:true}
    ); 


    return res
        .status(200)
        .json(new ApiResponse(200,updatedPlaylist,"Video removed Successfully"));

});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    // Validate playlistId
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    // Find playlist
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Check ownership
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to delete this playlist");
    }

    // Delete the playlist
    await playlist.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    // Validate ID
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    // Check if playlist exists
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Check ownership
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to update this playlist");
    }

    // Update fields only if provided (partial update)
    if (name) playlist.name = name;
    if (description) playlist.description = description;

    await playlist.save();

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});


export{
    createPlaylist,
    getMyPlaylists,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}