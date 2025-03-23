// src/themes.js
import { createTheme, alpha } from '@mui/material/styles';
import { teal, grey, purple, amber } from '@mui/material/colors';

// Light theme configuration
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6B46C1', // Purple
      light: '#A78BFA',
      dark: '#4C3D63',
      contrastText: '#fff',
    },
    secondary: {
      main: '#F9A825', // Amber
      light: '#FAD6A5',
      dark: '#C07500',
      contrastText: '#000',
    },
    background: {
      default: '#F9FAFB',
      paper: '#fff',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
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
          boxShadow: '0px 3px 7px rgba(0,0,0,0.15)',
        },
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 5px 15px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(16px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                backgroundColor: '#6B46C1',
                opacity: 1,
                border: 0,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
          },
          '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: '#E9E9EA',
            opacity: 1,
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          '& .MuiDataGrid-main': {
            width: '100%',
          },
          '& .MuiDataGrid-virtualScroller': {
            minHeight: '400px',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: alpha('#6B46C1', 0.1),
            fontWeight: 600,
          },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${alpha('#e0e0e0', 0.5)}`,
            fontSize: '0.875rem',
          },
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: alpha('#6B46C1', 0.05),
          },
          '& .MuiDataGrid-toolbarContainer': {
            padding: '8px',
            backgroundColor: alpha('#fff', 0.9),
            borderRadius: '8px 8px 0 0',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: `1px solid ${alpha('#e0e0e0', 0.5)}`,
          },
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
      main: teal[500],
      light: teal[300],
      dark: teal[700],
    },
    secondary: {
      main: grey[300], // Lighter for better contrast
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff', // Brighter white
      secondary: '#e0e0e0', // Lighter grey for better contrast
    },
  },
  typography: {
    fontFamily: "'Inter', 'Outfit', sans-serif",
    h5: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 500,
      color: teal[300],
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: '0px 3px 7px rgba(0,0,0,0.2)',
        },
        containedPrimary: {
          backgroundColor: teal[500],
          color: '#fff',
          '&:hover': {
            backgroundColor: teal[700],
          },
        },
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 5px 15px rgba(0,0,0,0.3)',
          // Ensure content is visible in dark mode
          '& h1, & h2, & h3, & h4, & h5, & h6, & p, & li, & span': {
            color: '#e0e0e0',
          },
          '& a': {
            color: teal[300],
          }
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(16px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                backgroundColor: teal[500],
                opacity: 1,
                border: 0,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
          },
          '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: '#555',
            opacity: 1,
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          '& .MuiDataGrid-main': {
            width: '100%',
          },
          '& .MuiDataGrid-virtualScroller': {
            minHeight: '400px',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: alpha(teal[500], 0.2),
            color: '#ffffff',
            fontWeight: 600,
          },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${alpha('#fff', 0.1)}`,
            color: '#ffffff',
            fontSize: '0.875rem',
          },
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: alpha(teal[500], 0.1),
          },
          '& .MuiDataGrid-toolbarContainer': {
            padding: '8px',
            backgroundColor: alpha('#000', 0.2),
            borderRadius: '8px 8px 0 0',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: `1px solid ${alpha('#fff', 0.1)}`,
            color: '#ffffff',
          },
          '& .MuiTablePagination-root': {
            color: '#ffffff',
          },
          '& .MuiButtonBase-root': {
            color: '#ffffff',
          },
        },
      },
    },
  },
});

export default lightTheme; // Export light theme as default