# Limecord - Discord Clone

A Discord clone built with Next.js, Node.js, Express, Socket.io, and SQLite featuring authentication and real-time notifications.

## Features

- 🔐 User authentication (login/register)
- 💬 Real-time messaging
- 📱 Discord-like interface
- 🔔 Notification system
- 📱 Responsive design
- 🎨 Dark theme

## Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Socket.io Client
- Axios
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- Socket.io
- SQLite3
- JWT Authentication
- Bcrypt (password hashing)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd limecord-1
```

2. Install dependencies for both client and server:
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

3. Start the development servers:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend client on http://localhost:3000

### Manual Setup (Alternative)

If you prefer to run the servers separately:

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend client (in a new terminal):
```bash
cd client
npm run dev
```

## Usage

1. Open your browser and navigate to http://localhost:3000
2. Register a new account or login with existing credentials
3. Start chatting in the default channels (general, random, announcements)
4. Click the bell icon to view notifications
5. Send messages and see them appear in real-time

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `GET /api/profile` - Get user profile

### Channels
- `GET /api/channels` - Get all channels
- `GET /api/channels/:channelId/messages` - Get messages for a channel
- `POST /api/channels/:channelId/messages` - Send a message

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:notificationId/read` - Mark notification as read

## Database Schema

The application uses SQLite with the following tables:
- `users` - User accounts
- `channels` - Chat channels
- `messages` - Chat messages
- `notifications` - User notifications

## Environment Variables

Create a `.env` file in the server directory:
```
JWT_SECRET=your-secret-key-here
PORT=5000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
