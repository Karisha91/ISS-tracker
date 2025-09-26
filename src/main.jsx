import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { spaceTheme } from './theme/theme.js'
import './index.css'
import App from './App.jsx'

// Optional: Import Inter font
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={spaceTheme}>
      <CssBaseline /> {/* Normalizes CSS and applies theme */}
      <App />
    </ThemeProvider>
  </StrictMode>,
)