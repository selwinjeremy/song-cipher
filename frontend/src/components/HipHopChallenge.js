// src/components/HipHopChallenge.js
import React from 'react';
import { Typography, Button } from '@mui/material';

const HipHopChallenge = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Typography variant="h3" color="textPrimary" gutterBottom>
        Hip Hop Challenge
      </Typography>
      <Typography variant="h5" color="textSecondary" paragraph>
        Guess the current top-200 hip hop song based on the clues.
      </Typography>
      {/* Add your challenge content here */}
    </div>
  );
};

export default HipHopChallenge;