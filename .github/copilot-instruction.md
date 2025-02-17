# Event Management Platform Architecture

## Project Structure
```
event-management/
├── client/                 # React frontend
│   ├── src/
│   │   ├── app/           # App router directory
│   │   ├── components/     # Shadcn UI components
│   │   ├── lib/           # Utilities/auth
│   │   └── socket/        # WebSocket client
│   ├── public/
│   └── package.json
│
└── server/                # Node.js backend
    ├── src/
    │   ├── config/        # DB/Cloudinary config
    │   ├── controllers/   # API controllers
    │   ├── models/        # MongoDB schemas  
    │   ├── routes/        # Express routers
    │   ├── services/      # Business logic
    │   └── socket/        # WebSocket server
    └── package.json
```

## Technical Specifications

### Frontend (React + Shadcn)
- **Component Management**: 
  - Use official Shadcn CLI for adding components:
    ```bash
    npx shadcn@latest add component-name
    ```
  - This ensures proper installation with all required dependencies and correct component configuration
  - Maintains consistency with the project's theming system
  - Automatically updates components.json configuration
- **Auth Flow**: JWT-based authentication
  - Access tokens (15min expiry)
  - Refresh tokens stored in MongoDB
  - Token version tracking for invalidation
- **State Management**: Zustand for client-side state
- **Real-time Updates**: Socket.IO client with event listeners
- **UI Library**: Shadcn UI + Framer Motion animations
- **Form Handling**: React Hook Form with Zod validation

### Backend (Node.js + Express)
- **Auth**: JWT with MongoDB token storage
- **API Security**: Rate limiting, CORS, and Helmet
- **WebSockets**: Socket.IO server with room-based events
- **Image Upload**: Cloudinary SDK integration
- **Database**: MongoDB with Mongoose ODM

## API Endpoints

### Auth Routes
- POST /api/auth/register  `{ email, password, name }` - `UserSchema`
- POST /api/auth/login `{ email, password }` - `{ email, password }`
- POST /api/auth/refresh-token `{ refreshToken }` - `{ refreshToken }`
- POST /api/auth/logout `{ refreshToken }` - `{ refreshToken }`

### Event Routes
- GET /api/events
- GET /api/events/:id
- POST /api/events  `{ title, description, date, location, category, imageUrl, capacity, isPublic }` - `EventSchema`
- PUT /api/events/:id `{ title?, description?, date?, location?, category?, imageUrl?, capacity?, isPublic? }` - Partial `EventSchema`
- DELETE /api/events/:id
- POST /api/events/:id/attend
- DELETE /api/events/:id/attend

## WebSocket Events
- event:created
- event:updated
- event:deleted
- attendee:joined
- attendee:left

## Security Considerations
1. Input validation using Zod
2. Rate limiting on auth routes
3. CORS configuration
4. JWT token rotation
5. File upload restrictions
6. XSS prevention headers