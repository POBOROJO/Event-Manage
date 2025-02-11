# Event Management Platform

A full-stack event management solution with real-time capabilities and comprehensive event handling features.

## Features

### User Management

- User registration and authentication
- JWT-based secure login
- Guest access with limited features
- Role-based access control

### Event Operations

- Create, read, update, and delete events
- Advanced event filtering and search
- Real-time attendee tracking
- Category-based organization

### Technical Highlights

- Real-time updates using WebSockets
- Responsive design for all devices
- RESTful API architecture
- Secure data management

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Shadcn UI for components
- Framer Motion for animations
- Socket.io-client
- Zustand for state management

### Backend

- Node.js
- Express.js
- MongoDB
- Socket.io
- JWT authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn or pnpm

### Installation

1. Clone the repository

```bash
git clone https://github.com/username/event-management.git
```

2. Install dependencies

```bash
# Install backend dependencies
cd backend
npm install or yarn install or pnpm install

# Install frontend dependencies
cd ../frontend
npm install or yarn install
```

3. Configure environment variables

```bash
# Create .env files in both frontend and backend directories
cp .env.example .env
```

4. Start the application

```bash
# Start backend
cd backend
pnpm run dev

# Start frontend
cd frontend
npm start
```

## API Documentation

Detailed API documentation is available at `/api/docs` after starting the server.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
