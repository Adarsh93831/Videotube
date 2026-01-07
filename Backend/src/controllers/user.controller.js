import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Video } from "../models/video.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

import {sendEmail} from "../utils/sendEmail.js"
import crypto from "crypto";

const generateAccessandRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and Access Token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    //await as it will take time
    $or: [{ username }, { email }] // username and email can pe passed in combination if found by anyone of both then return
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avtarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avtarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avtarLocalPath);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // even if coverImageLocalPath is empty it will not upload anything to clodinary that is best part

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName: fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email: email.toLowerCase(),
    password: password,
    username: username.toLowerCase()
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  
  
  const { email, username, password } = req.body;

  if (!username && !email) {
   
    throw new ApiError(400, "username or email is required");
  }

  if (!password) {
   
    throw new ApiError(400, "password is required");
  }

  

  const user = await User.findOne({
    $or: [{ username }, { email }]
  });

  console.log(user);
  

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    
    throw new ApiError(401, "Invalid user credential");
  }

 

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken
        },
        "User Logged in successfuly"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  // Clear refreshToken from DB
  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});



const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorised request");
  }




  // used try catch for catching synchronous error of jwt.verify()

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token expired so login again");
    }

    const options = {
      httpOnly: true,
      secure: true
    };

    const { accessToken, refreshToken: newrefreshToken } = await generateAccessandRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newrefreshToken
          },
          "Access Token refreshed"
        )
      );
  } catch (err) {
    throw new ApiError(401, err?.message || "Invalid refresh Token");
  }
});



const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?.id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  //not returning sensitive info

  const user = await User.findById(req.user.id).select(
    "-password -refreshToken"
  );
  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "user not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email
      }
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  // here we have to update files so will use multer
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,

    {
      $set: {
        avatar: avatar.url // give url of clodinary img to database
      }
    },
    {
      new: true
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  // here we have to update files so will use multer
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "coverImage file is missing");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on coverImage");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,

    {
      $set: {
        coverImage: coverImage.url // give url of clodinary img to database
      }
    },
    {
      new: true
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "avatar updated successfully"));
});

//****/ basically if user clicks on a channel logo or goes to look on any other channel(basically another user profile)
const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const channel = await User.findOne({ username }).select("-password");
  if (!channel) throw new ApiError(404, "CHannel not found");

  const subscribersCount = await Subscription.countDocuments({
    channel: channel._id
  });

  let isSubscribed = false;

  if (req.user) {
    const subscription = await Subscription.findOne({
      subscriber: req.user._id,
      channel: channel._id
    });
    if (subscription) isSubscribed = true;
  }

  // FInd all videos uploaded by channel
  //Here without mentioning id will automatically wwill bew provided
  const videos = await Video.find({ owner: channel._id, isPublished: true })
    .sort({ createdAt: -1 })
    .select("title description thumbnail createdAt views");

  res.status(200).json({
    channel: {
      _id: channel._id,
      username: channel.username,
      fullName: channel.fullName,
      avatar: channel.avatar,
      coverImage: channel.coverImage,
      subscribersCount,
      isSubscribed
    },
    videos
  });
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate({
    path: "watchHistory",
    select: "title thumbnail duration views createdAt owner",
    populate: {
      path: "owner",
      select: "username avatar"
    }
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.watchHistory,
        "Watch history fetched successfully"
      )
    );
});


const forgotPassword= asyncHandler(async(req,res)=>{
    const { email } = req.body;

    const user=await User.findOne({email});
    if(!user) throw new ApiError(404,"User with this email not found");

    const resetToken=crypto.randomBytes(32).toString("hex");
    const hashedToken=crypto.createHash("sha256").update(resetToken).digest("hex");

     user.resetPasswordToken = hashedToken;
     user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save({validateBeforeSave:false});

    const resetURL=`${process.env.FRONTEND_RESET_URL}/reset-password/${resetToken}`;

    await sendEmail({
        to:user.email,
        subject:"Password Reset Request",
        text:`Reset your password using this link :\n\n${resetURL}`
    });
    
    res.status(200).json(new ApiResponse(200,"Reset link sent to your email"))
    
    });

const resetPassword= asyncHandler(async(req,res)=>{
    const { token } = req.params;
    const { password }= req.body;

    const hashedToken=crypto.createHash("sha256").update(token).digest("hex");

    const user=await User.findOne({
        resetPasswordToken:hashedToken,
        resetPasswordExpires:{$gt:Date.now()}
    });

    if(!user) throw new ApiError(400,"Invalid or expired reset token");

    user.password=password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpires=undefined;

    await user.save();

    res.status(200).json(new ApiResponse(200,"Password have been reset successfully"));
});


export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  forgotPassword,
  resetPassword
};
