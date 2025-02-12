// src/navigation/Navigation.js
import React from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', backgroundColor: '#1b1b1b', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" color="primary" gutterBottom>
              Hip Hop Challenge
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Guess the current top-200 hip hop song based on the clues.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/hip-hop-challenge')}
            >
              Start Challenge
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', backgroundColor: '#1b1b1b', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" color="secondary" gutterBottom>
              Pop Challenge
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Guess the current top-200 pop song based on the clues.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/pop-challenge')}
            >
              Start Challenge
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Navigation;