// src/themes.js
import { createTheme, alpha } from '@mui/material/styles';

// Light theme configuration
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF5533', // Orange from your design 
      light: '#FF7755',
      dark: '#DD3311',
      contrastText: '#fff',
    },
    secondary: {
      main: '#6B46C1', // Purple for accents
      light: '#8A65E0',
      dark: '#4C2E9E',
      contrastText: '#fff',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#4B5563',
    },
    // Custom background colors for different sections
    custom: {
      hero: '#FFFFFF',
      featuredDeals: '#F7F7F7',
      featuredDeals: '#FAFCFD',
      categoryBrowser: '#FFFFFF',
      todaysDeals: '#F7F7F7',
      restaurantCta: '#F7F7F7',
      newsletter: '#FFFFFF',
    }
  },
  typography: {
    fontFamily: '"Inter", "Outfit", sans-serif',
    h1: {
      fontSize: '2.75rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&.MuiButton-contained': {
            backgroundColor: '#FF5533',
            '&:hover': {
              backgroundColor: '#DD3311',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            },
          },
        },
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
  },
});

// Dark theme configuration
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF5533', // Keep the orange for consistency
      light: '#FF7755',
      dark: '#DD3311',
      contrastText: '#fff',
    },
    secondary: {
      main: '#6B46C1', // Purple for accents
      light: '#8A65E0',
      dark: '#4C2E9E',
      contrastText: '#fff',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
    },
    // Updated custom background colors for different sections in dark mode
    custom: {
      hero: '#121417',
      featuredDeals: '#181e2a',
      categoryBrowser: '#161a22',
      todaysDeals: '#181e2a',
      restaurantCta: '#212021',
      newsletter: '#121212',
    }
  },
  typography: {
    fontFamily: '"Inter", "Outfit", sans-serif',
    h1: {
      fontSize: '2.75rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&.MuiButton-contained': {
            backgroundColor: '#FF5533',
            '&:hover': {
              backgroundColor: '#DD3311',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            },
          },
        },
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: '#1E1E1E',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
    // Fix for Privacy & TOS pages styling in dark mode
    MuiPaper: {
      styleOverrides: {
        root: {
          '&.MuiPaper-root.privacy-page, &.MuiPaper-root.terms-page': {
            backgroundColor: '#1A1A1A',
            color: '#FFFFFF',
            '& h1, & h2, & h3, & h4, & h5, & h6, & p, & li': {
              color: '#FFFFFF',
            },
            '& a': {
              color: '#FF5533',
            },
          },
        },
      },
    },
  },
});

export default lightTheme; // Export light theme as default