# Videotube - Video Sharing Platform

A full-stack video sharing platform built with React (Frontend) and Node.js/Express (Backend).

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account for media storage

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Videotube
   ```

2. **Setup Backend**
   ```bash
   cd Backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Setup Frontend**
   ```bash
   cd Frontend
   npm install
   cp .env.example .env
   # Edit .env with your API URL
   ```

### Development

**Run Backend (Terminal 1):**
```bash
cd Backend
npm run dev
```

**Run Frontend (Terminal 2):**
```bash
cd Frontend
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:8000`

## 🏭 Production Deployment

### Option 1: Deploy Separately

#### Backend (Render, Railway, Heroku, etc.)

1. Set environment variables on your platform:
   - `PORT` - Server port (usually set by platform)
   - `NODE_ENV=production`
   - `MONGODB_URI` - Your MongoDB connection string
   - `DB_NAME` - Database name
   - `ACCESS_TOKEN_SECRET` - JWT secret
   - `REFRESH_TOKEN_SECRET` - JWT refresh secret
   - `CLOUDINARY_*` - Cloudinary credentials
   - `CORS_ORIGIN` - Your frontend URL

2. Deploy with:
   ```bash
   npm start
   ```

#### Frontend (Vercel, Netlify, etc.)

1. Set environment variable:
   - `VITE_API_URL=https://your-backend-url.com/api/v1`

2. Build command: `npm run build`
3. Output directory: `dist`

### Option 2: Combined Deployment

The backend can serve the frontend build in production:

1. Build frontend:
   ```bash
   cd Frontend
   npm run build
   ```

2. Set `NODE_ENV=production` on backend
3. Deploy backend - it will serve frontend from `Frontend/dist`

## 📁 Project Structure

```
├── Backend/
│   ├── src/
│   │   ├── app.js          # Express app configuration
│   │   ├── server.js       # Entry point
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Auth, upload middlewares
│   │   └── utils/          # Helper utilities
│   └── public/temp/        # Temporary upload storage
│
└── Frontend/
    ├── src/
    │   ├── api/            # API client
    │   ├── components/     # React components
    │   ├── pages/          # Page components
    │   └── store/          # Zustand state management
    └── dist/               # Production build
```

## 🔧 Environment Variables

### Backend (.env)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 8000) |
| `NODE_ENV` | Environment (development/production) |
| `MONGODB_URI` | MongoDB connection string |
| `DB_NAME` | Database name |
| `ACCESS_TOKEN_SECRET` | JWT access token secret |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CORS_ORIGIN` | Allowed origins (comma-separated) |

### Frontend (.env)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |

## 📝 API Endpoints

- `GET /health` - Health check endpoint
- `/api/v1/users` - User authentication & profile
- `/api/v1/videos` - Video CRUD operations
- `/api/v1/comments` - Comment management
- `/api/v1/subscription` - Channel subscriptions
- `/api/v1/playlist` - Playlist management
- `/api/v1/likes` - Like/unlike videos
- `/api/v1/admin` - Admin operations

## 🛡️ Security Notes

- Never commit `.env` files to version control
- Use strong, unique secrets for JWT tokens
- Enable HTTPS in production
- Restrict CORS to your frontend domain only
