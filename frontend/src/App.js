// src/App.js
import React from 'react';
import { CssBaseline, Typography, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HipHopChallenge from './components/HipHopChallenge';
import PopChallenge from './components/PopChallenge';
import Navigation from './navigation/Navigation';
import theme from './themes/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Typography variant="h3" color="textPrimary" gutterBottom>
            Welcome to Song-Cipher
          </Typography>
          <Typography variant="h5" color="textSecondary" paragraph>
            Decipher the musical clues to solve today's song challenge
          </Typography>

          {/* Render Navigation Component */}
          <Navigation />

          {/* Define the Routes */}
          <Routes>
            <Route path="/hip-hop-challenge" element={<HipHopChallenge />} />
            <Route path="/pop-challenge" element={<PopChallenge />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;