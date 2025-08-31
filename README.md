# SyncNote - Offline-First Note Taking Desktop App

SyncNote is a modern, offline-first note-taking desktop application built with Electron, React, and TypeScript. It features seamless synchronization, offline capabilities, and a clean, responsive interface.

## 🌟 Features

### Core Features
- ✏️ **Create and Manage Notes**
  - Create notes with titles and content
  - Real-time editing
  - Rich text formatting

- 🔄 **Offline-First Architecture**
  - Work without internet connection
  - Automatic background sync when online
  - Local data persistence using IndexedDB

- 🔐 **User Authentication**
  - Secure signup and login
  - JWT-based authentication
  - Protected routes

### Technical Features
- 📱 **Responsive Design**
  - Adapts to different screen sizes
  - Touch-friendly interface
  - Customizable window sizes

- 🎨 **Theme Support**
  - Light and dark mode
  - Customizable font sizes
  - Modern, clean UI

- 💾 **Data Management**
  - Redis caching for improved performance
  - MongoDB for persistent storage
  - Efficient pagination

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB
- Redis

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sync-note.git
cd sync-note
```

2. Install dependencies for both client and server:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:

Server (.env):
```env
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
```

Client (.env):
```env
VITE_BACKEND_URL=http://localhost:8000
```

4. Start the application:

Development mode:
```bash
# Start server
cd server
npm run server

# Start client
cd client
npm run dev
```

Build for production:
```bash
# Build server
cd server
npm run build

# Build client
cd client
npm run dist
```

## 🏗️ Architecture

### Frontend
- React with TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- Dexie.js for IndexedDB
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Redis for caching
- JWT authentication
- TypeScript

## 💻 Usage

1. **Sign Up/Login**: Create an account or log in to access your notes

2. **Create Notes**: 
   - Click "Add Note" button
   - Enter title and content
   - Notes are saved automatically

3. **Offline Mode**:
   - Continue working without internet
   - Changes sync automatically when online

4. **Settings**:
   - Customize theme (light/dark)
   - Adjust font size
   - Manage window size

## 🔧 Configuration

### Electron Builder Configuration
```json
{
  "build": {
    "appId": "com.yourname.syncnote",
    "productName": "SyncNote",
    "directories": {
      "output": "dist"
    }
  }
}
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

