import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, `username is required`],
      unique: true,
      lowercase: true,
      trim: true,
      index: true //if we want to enable searchiing on any field we make its index:true
    },
    email: {
      type: String,
      required: [true, `Email is required`],
      unique: true,
      lowercase: true,
      trim: true
    },
    fullName: {
      type: String,
      // required: [true, `fullName is required`],
      required: true,
      index: true
    },
    avatar: {
      type: String, //cloudinary url
      required: [true, `avatar is required`]
    },
    coverImage: {
      type: String //cloudinary url
    },
    watchHistory: [
      //arary of reference of videos
      {
        type: Schema.Types.ObjectId,
        ref: "Video"
      }
    ],

    password: {
      type: String,
      required: [true, `password is required`]
    },
    refreshToken: {
      type: String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    role: {
   type: String,
   enum: ["user", "admin"],
   default: "user",
    }

  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this.id,
      email: this.email,
      username: this.username,
      fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      /* payload */
      _id: this.id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
};

export const User = mongoose.model("User", userSchema);
