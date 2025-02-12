// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

// Create the custom theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff5733',
    },
    secondary: {
      main: '#3498db',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#f1f1f1',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 400,
    },
  },
});

export default theme;