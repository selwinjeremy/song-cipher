// src/App.js
import React, { useState, useEffect } from 'react';
import { CssBaseline, Typography, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Button } from '@mui/material';
import HipHopChallenge from './components/HipHopChallenge';
import PopChallenge from './components/PopChallenge';
import Navigation from './navigation/Navigation';
import theme from './themes/theme';
import PlaylistChallenge from './components/PlaylistChallenge';

function App() {

  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token");
    if (token) {
      setAccessToken(token);
      localStorage.setItem("spotify_access_token", token); // Store for later use
    } else {
      const storedToken = localStorage.getItem("spotify_access_token");
      if (storedToken) setAccessToken(storedToken);
    }
  }, []);



  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Typography variant="h3" color="textPrimary" gutterBottom>
            Welcome to Song-Cipher
          </Typography>
          <Typography variant="h5" color="textSecondary" paragraph>
            Decipher the musical clues to guess the song!
          </Typography>

          {/* Render Navigation Component */}
          <Navigation />

          {/* Define the Routes */}
          <div style={{ padding: '20px', textAlign: 'center' }}>
            {!accessToken ? (
              <Button variant="contained" color="primary" href={`${process.env.REACT_APP_API_URI}/login`}>
                Login with Spotify
              </Button>
            ) : (
              <Routes>
                <Route path="/hip-hop-challenge" element={<HipHopChallenge />} />
                <Route path="/pop-challenge" element={<PopChallenge />} />
                <Route path="/playlist-challenge" element={<PlaylistChallenge/>} />
              </Routes>
            )}
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;