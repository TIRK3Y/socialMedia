import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import { getTheme } from './theme';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import TaskManager from './pages/TaskManager';

function App() {
  const [mode, setMode] = useState('light');
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Container maxWidth={false} disableGutters>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login setMode={setMode} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile setMode={setMode} />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/task" element={<TaskManager />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
