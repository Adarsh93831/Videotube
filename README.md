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

---

## 🏭 Production Deployment

### Option 1: Deploy with Docker (Recommended)

```bash
# Development
docker-compose up --build

# Production
docker-compose -f docker-compose.prod.yml up --build -d
```

### Option 2: Deploy Separately

#### Backend Deployment (Render / Railway / Heroku)

1. **Render.com:**
   - Connect your GitHub repo
   - Root Directory: `Backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables from `.env.example`

2. **Railway:**
   - Connect GitHub repo
   - Set root directory to `Backend`
   - Add environment variables
   - Deploy automatically

3. **Heroku:**
   ```bash
   cd Backend
   heroku create your-app-name
   heroku config:set NODE_ENV=production
   # Set all other env variables
   git push heroku main
   ```

#### Frontend Deployment (Vercel / Netlify)

1. **Vercel (Recommended):**
   - Import GitHub repo
   - Root Directory: `Frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Add Environment Variable:
     - `VITE_API_URL=https://your-backend-url.com/api/v1`

2. **Netlify:**
   - Connect GitHub repo
   - Base Directory: `Frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Add Environment Variable: `VITE_API_URL`

### Option 3: Combined Deployment

The backend can serve the frontend build in production:

1. Build frontend:
   ```bash
   cd Frontend
   npm run build
   ```

2. Set `NODE_ENV=production` on backend
3. Deploy backend - it will serve frontend from `Frontend/dist`

---

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
│   ├── public/temp/        # Temporary upload storage
│   ├── Dockerfile          # Docker configuration
│   └── Procfile            # Heroku configuration
│
├── Frontend/
│   ├── src/
│   │   ├── api/            # API client
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── store/          # Zustand state management
│   ├── dist/               # Production build
│   ├── Dockerfile          # Docker configuration
│   ├── nginx.conf          # Nginx configuration
│   └── vercel.json         # Vercel configuration
│
├── docker-compose.yml      # Docker Compose for development
└── docker-compose.prod.yml # Docker Compose for production
```

---

## 🔧 Environment Variables

### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 8000) | No |
| `NODE_ENV` | Environment (development/production) | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `DB_NAME` | Database name | Yes |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | Yes |
| `ACCESS_TOKEN_EXPIRY` | Access token expiry (e.g., 1d) | Yes |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | Yes |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiry (e.g., 10d) | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `CORS_ORIGIN` | Allowed origins (comma-separated) | Yes |
| `SMTP_EMAIL` | Email for sending notifications | No |
| `SMTP_PASSWORD` | Email app password | No |
| `FRONTEND_RESET_URL` | Frontend URL for password reset | No |
| `HF_TOKEN` | Hugging Face API token | No |
| `GEMINI_API_KEY` | Google Gemini API key | No |

### Frontend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |

---

## 📝 API Endpoints

- `GET /health` - Health check endpoint
- `/api/v1/users` - User authentication & profile
- `/api/v1/videos` - Video CRUD operations
- `/api/v1/comments` - Comment management
- `/api/v1/subscription` - Channel subscriptions
- `/api/v1/playlist` - Playlist management
- `/api/v1/likes` - Like/unlike videos
- `/api/v1/admin` - Admin operations

---

## 🛡️ Security Checklist

- [ ] Never commit `.env` files to version control
- [ ] Use strong, unique secrets for JWT tokens (256+ bits)
- [ ] Enable HTTPS in production
- [ ] Restrict CORS to your frontend domain only
- [ ] Set `NODE_ENV=production` in production
- [ ] Use MongoDB Atlas with IP whitelisting
- [ ] Enable Cloudinary signed uploads for security

---

## 📋 Deployment Checklist

### Before Deploying:
- [ ] Update `CORS_ORIGIN` to your frontend domain
- [ ] Update `FRONTEND_RESET_URL` to your frontend URL
- [ ] Generate new JWT secrets for production
- [ ] Test the production build locally
- [ ] Verify all environment variables are set

### After Deploying:
- [ ] Test the `/health` endpoint
- [ ] Test user registration and login
- [ ] Test video upload functionality
- [ ] Check CORS is working correctly
- [ ] Monitor error logs
