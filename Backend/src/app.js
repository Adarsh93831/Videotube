import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = e();

// More permissive CORS for development
app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://localhost:5173", 
      "http://127.0.0.1:5173",
      "http://localhost:4173", 
      "http://127.0.0.1:4173"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(e.json({ limit: "16kb" }));
app.use(e.urlencoded({ extended: true, limit: "16kb" }));
app.use(e.static("public"));
app.use(cookieParser());

// Add logging middleware to track requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  console.log('Request body:', req.body)
  next()
})



import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import likeRouter from "./routes/like.routes.js"
import adminRouter from "./routes/admin.routes.js"





app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos",videoRouter);
app.use("/api/v1/comments",commentRouter);
app.use("/api/v1/subscription",subscriptionRouter);
app.use("/api/v1/playlist",playlistRouter);
app.use("/api/v1/likes",likeRouter);
app.use("/api/v1/admin",adminRouter);



export { app };