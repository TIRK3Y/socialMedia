// pages/Dashboard.jsx
import React from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Typography variant="h6" sx={{ m: 2 }}>User Dashboard</Typography>
        <List>
          <ListItem button onClick={() => navigate('/dashboard/profile')}>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={() => navigate('/dashboard/settings')}>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
