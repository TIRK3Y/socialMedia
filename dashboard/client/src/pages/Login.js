import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  IconButton,
  Stack,
} from '@mui/material';
import { login } from '../api/auth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Brightness7Icon from '@mui/icons-material/Brightness7'; // sun icon
import Brightness4Icon from '@mui/icons-material/Brightness4'; // moon icon

export default function Login({ setMode, mode }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const data = await login(form);
    if (data.message) {
      setError(data.message);
    } else {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/feed');
    }
  };

  const toggleDarkMode = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <Box maxWidth={400} mx="auto" mt={5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Login</Typography>
        <IconButton onClick={toggleDarkMode} color="inherit">
          {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      </Stack>

      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <TextField
          name="email"
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          required
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          required
          value={form.password}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>

      <Typography mt={2} variant="body2" align="center">
        Don't have an account?{' '}
        <Link component={RouterLink} to="/signup" underline="hover" sx={{ cursor: 'pointer' }}>
          Sign Up
        </Link>
      </Typography>
    </Box>
  );
}
