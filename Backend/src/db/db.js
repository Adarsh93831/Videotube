import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const DB_NAME = process.env.DB_NAME || "test";
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected ! DB Host :${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.log(`MongoDB connection failed !!! : ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
