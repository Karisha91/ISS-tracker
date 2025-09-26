import { createTheme } from '@mui/material/styles';

export const spaceTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa',    // Bright space blue
      light: '#93c5fd',
      dark: '#3b82f6'
    },
    secondary: {
      main: '#c4b5fd',    // Cosmic purple
      light: '#ddd6fe',
      dark: '#a78bfa'
    },
    background: {
      default: '#0f172a', // Deep space
      paper: '#1e293b'    // Card background
    },
    text: {
      primary: '#f8fafc', // Light text for contrast
      secondary: '#cbd5e1',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
});