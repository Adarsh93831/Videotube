import mongoose,{isValidObjectId }from "mongoose";
import { ApiError } from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Subscription } from "../models/subscription.models.js"
import { User } from "../models/user.models.js";

const toggleSubscription=asyncHandler(async(req,res)=>{
    const {channelId}=req.params
    
    if(!isValidObjectId(channelId))
    {
        throw new ApiError(400,"Invalid channelId format");
    }

     const channel = await User.findById(channelId);
    if (!channel) {
    throw new ApiError(404, "Channel (user) not found");
    }

    if(req.user._id.toString()===channelId){
        throw new ApiError(400,"You cannot subscribe to yourself");    
    }

    const existingSubscription=await Subscription.findOne({
        channel:channelId,
        subscriber:req.user._id,
    });

    if(existingSubscription)
    {
        await existingSubscription.deleteOne();
        return res
        .status(200)
        .json(new ApiResponse(200,null,"Unsubscribed successfully"))
    }
    else{
        await Subscription.create({
             channel:channelId,
            subscriber:req.user._id,
        });

        return res
        .status(200)
        .json(new ApiResponse(200,null,"Subscribed successfully"))


    }
});

const getMySubscribers = asyncHandler(async (req, res) => {
    const subscribers = await Subscription.find({ channel: req.user._id })
        .populate({
            path: "subscriber",
            select: "username fullName avatar",
        });

    return res.status(200).json(new ApiResponse(200, subscribers));
});

const getMySubscribedChannels = asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.find({ subscriber: req.user._id })
        .populate({
            path: "channel",
            select: "username fullName avatar",
        });

    return res.status(200).json(new ApiResponse(200, subscriptions));
});

export{
    toggleSubscription,
    getMySubscribers,
    getMySubscribedChannels
}





























