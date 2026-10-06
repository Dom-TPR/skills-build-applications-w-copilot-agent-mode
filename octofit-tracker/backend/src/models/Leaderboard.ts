import { model, Schema } from 'mongoose';

const leaderboardSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
    period: { type: String, enum: ['weekly', 'monthly', 'all-time'], required: true },
    points: { type: Number, min: 0, required: true },
    rank: { type: Number, min: 1, required: true },
  },
  { timestamps: true },
);

export default model('Leaderboard', leaderboardSchema);