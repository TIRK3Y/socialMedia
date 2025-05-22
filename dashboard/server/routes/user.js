import express from 'express';
import multer from 'multer';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Multer setup - store file in memory for quick base64 conversion
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, upload.single('photo'), async (req, res) => {
  try {
    const { name, phone, role, bio } = req.body;
    const photo = req.file ? req.file.buffer.toString('base64') : undefined;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (role) updateFields.role = role;
    if (bio) updateFields.bio = bio;
    if (photo) updateFields.photo = photo;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
