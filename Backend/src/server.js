import { app } from "./app.js";

import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/db.js";


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
