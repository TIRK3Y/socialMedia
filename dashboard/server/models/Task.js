import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);
export default Task;  // <-- Make sure this is present
