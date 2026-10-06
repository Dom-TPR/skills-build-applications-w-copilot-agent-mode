import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    grade: { type: Number, min: 9, max: 12 },
  },
  { timestamps: true },
);

export default model('User', userSchema);