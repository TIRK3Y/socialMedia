import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Stack, Card, CardContent } from '@mui/material';

export default function FriendsFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:5000/api/posts/friends', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error('Failed to fetch friends posts', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendPosts();
  }, []);

  if (loading) return <CircularProgress />;

  if (!posts.length)
    return (
      <Typography variant="h6" align="center" mt={5}>
        No posts from friends yet.
      </Typography>
    );

  return (
    <Box maxWidth={600} mx="auto" mt={5}>
      <Typography variant="h4" mb={3} align="center">
        Friends' Posts
      </Typography>

      <Stack spacing={3}>
        {posts.map((post) => (
          <Card key={post._id}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                {post.authorName}
              </Typography>
              <Typography variant="body1">{post.content}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(post.createdAt).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
