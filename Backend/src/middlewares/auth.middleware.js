import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

 const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "unauthorised Request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, err?.message || "invalid Access Token");
  }
};


 const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(new ApiError(403, "Access denied: Admins only"));
  }
  next();
};

export{
  isAdmin,
  verifyJWT
}