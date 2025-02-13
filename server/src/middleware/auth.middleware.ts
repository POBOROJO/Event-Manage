// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import User, { IUser } from '../models/User';

// // Extend Express Request type to include user
// declare global {
//   namespace Express {
//     interface Request {
//       user?: IUser;
//       isGuest?: boolean;
//       guestSessionId?: string;
//     }
//   }
// }

// export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // Check for JWT token
//     const token = req.headers.authorization?.split(' ')[1];
    
//     if (token) {
//       try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
//         const user = await User.findById(decoded.id).select('-password');
        
//         if (user) {
//           req.user = user;
//           return next();
//         }
//       } catch (error) {
//         // Token verification failed, continue to guest check
//       }
//     }

//     // Check for guest session
//     const guestSessionId = req.headers['x-guest-session'] as string;
    
//     if (guestSessionId) {
//       const guestSession = await Guest.findOne({ 
//         sessionId: guestSessionId,
//         expiresAt: { $gt: new Date() }
//       });

//       if (guestSession) {
//         // Update last accessed time
//         guestSession.lastAccessed = new Date();
//         await guestSession.save();

//         req.isGuest = true;
//         req.guestSessionId = guestSessionId;
//         return next();
//       }
//     }

//     return res.status(401).json({ message: 'Authentication required' });
//   } catch (error) {
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

// export const guestOnlyMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   if (!req.isGuest) {
//     return res.status(403).json({ message: 'This route is only available for guest users' });
//   }
//   next();
// };

// export const userOnlyMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   if (!req.user || req.isGuest) {
//     return res.status(403).json({ message: 'This route requires full user authentication' });
//   }
//   next();
// };

// export const createGuestSession = async (ipAddress: string): Promise<string> => {
//   // Check rate limit
//   const isLimited = await Guest.isRateLimitExceeded(ipAddress);
//   if (isLimited) {
//     throw new Error('Guest session rate limit exceeded');
//   }

//   // Create new guest session
//   const sessionId = jwt.sign({ guest: true }, process.env.JWT_SECRET!, { expiresIn: '24h' });
//   const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

//   await Guest.create({
//     sessionId,
//     expiresAt,
//     ipAddress,
//     lastAccessed: new Date(),
//   });

//   return sessionId;
// };
