import { model, Schema } from 'mongoose';

const workoutSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    exercises: [
      {
        name: { type: String, required: true },
        durationMinutes: { type: Number, min: 1 },
        sets: { type: Number, min: 1 },
        reps: { type: Number, min: 1 },
      },
    ],
  },
  { timestamps: true },
);

export default model('Workout', workoutSchema);