import express from 'express';
import auth from '../middleware/auth.js';
import multer from 'multer';
import Post from '../models/Post.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create new post
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });

    const image = req.file ? req.file.buffer.toString('base64') : '';

    const post = new Post({
      user: req.user.id,
      content,
      image,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all posts (feed)
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name photo')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get posts by specific user (optional)
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'name photo')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
