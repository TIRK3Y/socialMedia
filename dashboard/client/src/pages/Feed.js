import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Modal,
} from '@mui/material';
import Navigation from './component/Navigation.jsx';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [editPost, setEditPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const token = localStorage.getItem('token');

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!content.trim()) {
      setError('Content cannot be empty');
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    if (imageFile) formData.append('image', imageFile);

    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to create post');
        return;
      }

      setContent('');
      setImageFile(null);
      fetchPosts();
    } catch (err) {
      setError('Server error');
    }
  };

  const handleDelete = async (postId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditOpen = (post) => {
    setEditPost(post);
    setEditContent(post.content);
  };

  const handleEditSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${editPost._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editContent }),
      });

      if (res.ok) {
        setEditPost(null);
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navigation />
      <Box maxWidth={600} mx="auto" mt={5}>
        <Typography variant="h5" mb={2}>
          Create a Post
        </Typography>
        <form onSubmit={handlePostSubmit}>
          <TextField
            label="What's on your mind?"
            multiline
            rows={3}
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            style={{ marginBottom: 10 }}
          />
          {error && <Typography color="error" mb={1}>{error}</Typography>}
          <Button type="submit" variant="contained" color="primary">
            Post
          </Button>
        </form>

        <Box mt={5}>
          <Typography variant="h6" mb={2}>
            Feed
          </Typography>
          {posts.length === 0 && <Typography>No posts yet</Typography>}
          {posts.map((post) => (
            <Card key={post._id} sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar
                    src={
                      post.user?.photo
                        ? `data:image/jpeg;base64,${post.user.photo}`
                        : '/default-user.png'
                    }
                    alt={post.user?.name || 'User'}
                    sx={{ mr: 2 }}
                  />
                  <Typography fontWeight="bold">
                    {post.user?.name || 'Unknown User'}
                  </Typography>
                  <Typography sx={{ ml: 'auto', fontSize: 12, color: 'gray' }}>
                    {new Date(post.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                <Typography mb={1}>{post.content}</Typography>
                {post.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`data:image/jpeg;base64,${post.image}`}
                    alt="Post image"
                    sx={{ borderRadius: 1 }}
                  />
                )}
                {post.isOwner && (
                  <Box mt={1}>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleEditOpen(post)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      <Modal open={!!editPost} onClose={() => setEditPost(null)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>Edit Post</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={() => setEditPost(null)} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleEditSubmit}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Feed;
