import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photo: { type: String, default: '' }, // base64 or URL
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, default: '' },
  bio: { type: String, default: '' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
