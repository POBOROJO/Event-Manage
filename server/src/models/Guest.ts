import { Schema, model, Document, Model } from 'mongoose';

export interface IGuest extends Document {
  sessionId: string;
  expiresAt: Date;
  ipAddress: string;
  lastAccessed: Date;
}

interface IGuestModel extends Model<IGuest> {
  isRateLimitExceeded(ipAddress: string): Promise<boolean>;
  cleanupExpiredSessions(): Promise<void>;
}

const guestSchema = new Schema<IGuest>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    ipAddress: {
      type: String,
      required: true,
      index: true,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically remove expired sessions
guestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Rate limiting index
guestSchema.index({ ipAddress: 1, createdAt: 1 });

// Helper method to check if rate limit is exceeded
guestSchema.static('isRateLimitExceeded', async function(ipAddress: string): Promise<boolean> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const count = await this.countDocuments({
    ipAddress,
    createdAt: { $gte: oneDayAgo },
  });
  return count >= 5; // 5 sessions per IP per day
});

// Helper method to cleanup old sessions
guestSchema.static('cleanupExpiredSessions', async function(): Promise<void> {
  await this.deleteMany({ expiresAt: { $lt: new Date() } });
});

export default model<IGuest, IGuestModel>('Guest', guestSchema);
