# VideoTube Frontend

A modern, responsive video sharing platform built with React, Vite, Tailwind CSS, and Zustand.

## Features

- 🎥 **Video Streaming** - Watch videos with a custom player
- 📤 **Video Upload** - Upload videos with thumbnails
- 👤 **User Authentication** - Register, login, forgot password
- 📺 **Channel Pages** - View user profiles and their videos
- 💬 **Comments** - Add, edit, and delete comments
- ❤️ **Likes** - Like videos and comments
- 📋 **Playlists** - Create and manage playlists
- 🔔 **Subscriptions** - Subscribe to channels
- 📜 **Watch History** - Track watched videos
- 🔍 **Search** - Search videos with filters
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **React 18** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Zustand** - State Management
- **React Router v6** - Routing
- **Axios** - HTTP Client
- **React Icons** - Icons
- **React Hot Toast** - Notifications
- **React Player** - Video Player
- **date-fns** - Date Formatting

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running on http://localhost:8000

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
Frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   ├── axios.js          # Axios instance with interceptors
│   │   └── index.js          # API endpoints
│   ├── components/
│   │   ├── Auth/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── Comment/
│   │   │   ├── CommentCard.jsx
│   │   │   └── CommentSection.jsx
│   │   ├── Layout/
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   └── Video/
│   │       ├── VideoCard.jsx
│   │       ├── VideoCardSkeleton.jsx
│   │       └── VideoGrid.jsx
│   ├── pages/
│   │   ├── Channel.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── History.jsx
│   │   ├── Home.jsx
│   │   ├── LikedVideos.jsx
│   │   ├── Login.jsx
│   │   ├── PlaylistDetail.jsx
│   │   ├── Playlists.jsx
│   │   ├── Register.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── Search.jsx
│   │   ├── Settings.jsx
│   │   ├── Subscriptions.jsx
│   │   ├── Upload.jsx
│   │   └── VideoPlayer.jsx
│   ├── store/
│   │   ├── authStore.js      # Authentication state
│   │   ├── commentStore.js   # Comments state
│   │   ├── likeStore.js      # Likes state
│   │   ├── playlistStore.js  # Playlists state
│   │   ├── subscriptionStore.js
│   │   ├── uiStore.js        # UI state (sidebar, theme)
│   │   └── videoStore.js     # Videos state
│   ├── utils/
│   │   └── helpers.js        # Utility functions
│   ├── App.jsx               # Main app component
│   ├── index.css             # Global styles
│   └── main.jsx              # Entry point
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## API Integration

The frontend connects to the backend API at `http://localhost:8000/api/v1`. The API endpoints include:

- `/users` - Authentication and user management
- `/videos` - Video CRUD operations
- `/comments` - Comment management
- `/likes` - Like/unlike functionality
- `/subscriptions` - Subscription management
- `/playlists` - Playlist management

## State Management

Zustand stores are used for global state management:

- **authStore** - User authentication state and actions
- **videoStore** - Videos list and current video
- **commentStore** - Comments for current video
- **likeStore** - Liked videos
- **subscriptionStore** - Subscriptions and subscribers
- **playlistStore** - User playlists
- **uiStore** - UI preferences (sidebar, theme)

## Styling

Tailwind CSS is used for styling with a custom theme:

- Dark mode by default
- Custom color palette (primary red, dark grays)
- Responsive breakpoints
- Custom animations and transitions
- Loading skeletons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License
