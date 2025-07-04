import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/db.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at port:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed ", err);
  });
