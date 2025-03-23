// src/theme.js (modified)
import { createTheme, alpha } from '@mui/material/styles';
import { grey, teal } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: 'dark', // Enable dark mode
    primary: {
      main: teal[500], // Vibrant teal
    },
    secondary: {
      main: grey[700], // A dark grey for secondary elements
    },
    background: {
      default: '#121212', // Very dark grey background
      paper: '#1e1e1e', // Slightly lighter for paper elements
    },
    text: {
      primary: '#fff', // White text for readability on dark backgrounds
      secondary: grey[400], // A lighter grey for less important text
    },
    error: {
      main: '#f44336', // Standard error red
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif", // Using Inter font
    h5: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 500,
      color: teal[300],
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 5px 15px rgba(0,0,0,0.3)', // More pronounced shadow
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: grey[600],
            },
            '&:hover fieldset': {
              borderColor: teal[300],
            },
            '&.Mui-focused fieldset': {
              borderColor: teal[500],
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: grey[600],
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: teal[300],
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: teal[500],
            borderWidth: 2,
          },
        },
      },
    },
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
        outlined: {
          borderColor: teal[300],
          color: teal[300],
          '&:hover': {
            backgroundColor: 'rgba(0, 150, 136, 0.08)', // Light teal background on hover
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: -11, // Adjust spacing for switch label
        },
        label: {
          color: grey[300],
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-thumb': {
            backgroundColor: grey[100],
          },
          '& .MuiSwitch-track': {
            backgroundColor: grey[500],
          },
          '&.Mui-checked': {
            color: teal[500],
            '& + .MuiSwitch-track': {
              backgroundColor: teal[500],
            },
          },
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            backgroundColor: '#333', // Darker background for snackbar
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2a2a2a', // Darker background for dialog
          color: '#fff',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          marginBottom: 8,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: teal[300],
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 150, 136, 0.08)', // Light teal background on hover
          },
        },
      },
    },
    // Add DataGrid specific styling
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
            backgroundColor: alpha(teal[500], 0.15),
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 600,
          },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${alpha('#fff', 0.1)}`,
            fontSize: '0.9rem',
          },
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: alpha(teal[500], 0.1),
          },
          '& .MuiTablePagination-root': {
            color: grey[300],
          },
          '& .MuiIconButton-root': {
            color: grey[300],
          },
          '& .MuiDataGrid-toolbarContainer': {
            padding: '8px',
            backgroundColor: alpha('#000', 0.2),
            borderRadius: '8px 8px 0 0',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: `1px solid ${alpha('#fff', 0.1)}`,
          },
        },
        virtualScroller: {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(teal[500], 0.5),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: alpha('#fff', 0.05),
            borderRadius: '4px',
          },
        },
      },
    },
  },
});

export default theme;