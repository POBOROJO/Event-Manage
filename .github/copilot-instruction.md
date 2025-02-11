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

### Database Schema Overview

#### User Collection
```typescript
{
  email: string
  password: string (hashed)
  name: string
  tokenVersion: number
  refreshTokens: [{
    token: string
    expiresAt: Date
  }]
  createdAt: Date
  updatedAt: Date
}
```

#### Zod User Schema Example
```typescript
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(3),
  tokenVersion: z.number().default(0),
  refreshTokens: z.array(
    z.object({
      token: z.string(),
      expiresAt: z.date(),
    })
  ).default([]),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});
```

#### Event Collection
```typescript
{
  title: string
  description: string
  date: Date
  location: string
  category: string
  imageUrl: string
  creator: ObjectId (ref: User)
  attendees: [ObjectId] (ref: User)
  capacity: number
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}
```

#### Zod Event Schema Example

```typescript
import { z } from 'zod';
import { ObjectId } from 'mongodb';

const EventSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  date: z.date(),
  location: z.string().min(3).max(100),
  category: z.string().min(3).max(50),
  imageUrl: z.string().url(),
  creator: z.instanceof(ObjectId),
  attendees: z.array(z.instanceof(ObjectId)).default([]),
  capacity: z.number().positive().int(),
  isPublic: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});
```

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