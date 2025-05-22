import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="sticky">
  <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
    <Typography variant="h6" component="div">
      tirkey's Social
    </Typography>
    <Box>
      <Button color="inherit" onClick={() => navigate('/feed')}>Feed</Button>
      <Button color="inherit" onClick={() => navigate('/profile')}>Profile</Button>
      <Button color="inherit" onClick={() => navigate('/task')}>Task</Button>
    </Box>
  </Toolbar>
</AppBar>

  );
}

export default Navigation;
