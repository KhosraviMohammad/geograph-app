import React, { useEffect } from 'react'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import rtlPlugin from 'stylis-plugin-rtl'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { useSelector } from 'react-redux'
import { selectThemeMode, selectThemeDirection } from '../store/selectors/themeSelectors.ts'

interface MaterialUIProviderProps {
  children: React.ReactNode
}

// Create dynamic cache based on direction
const createCacheWithDirection = (direction: string) => {
  // Emotion already includes the default prefixer. Only add RTL plugin when needed.
  return createCache({
    key: direction === 'rtl' ? 'muirtl' : 'muiltr',
    stylisPlugins: direction === 'rtl' ? [rtlPlugin] : [],
  })
}

export const MaterialUIProvider = ({ children }: MaterialUIProviderProps) => {
  // Get theme state from Redux
  const mode = useSelector(selectThemeMode)
  const direction = useSelector(selectThemeDirection)

  // Save theme preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('theme-mode', mode)
    localStorage.setItem('theme-direction', direction)
  }, [mode, direction])

  // Create Material-UI theme
  const theme = createTheme({
    direction: direction,
    palette: {
      mode: mode,
      primary: {
        main: '#dab23b', // Golden Yellow from logo
        light: '#e3ce5c',
        dark: '#a78e26',
        contrastText: '#000000',
      },
      secondary: {
        main: '#000000',
        light: '#333333',
        dark: '#111111',
        contrastText: '#FFFFFF',
      },
      background: {
        default: mode === 'light' ? '#FFFFFF' : '#1A1A1A',
        paper: mode === 'light' ? '#FAFAF5' : '#2A2A2A',
      },
      text: {
        primary: mode === 'light' ? '#000000' : '#FFFFFF',
        secondary: mode === 'light' ? '#555555' : '#DDDDDD',
      },
      error: {
        main: '#FF6B6B',
        light: '#FF8E8E',
        dark: '#E55555',
      },
      success: {
        main: '#51CF66',
        light: '#69DB7C',
        dark: '#40C057',
      },
      warning: {
        main: '#FFD43B',
        light: '#FFE066',
        dark: '#FCC419',
      },
      info: {
        main: '#74C0FC',
        light: '#91D5FF',
        dark: '#4DABF7',
      },
    },
    typography: {
      fontFamily: [
        'Inter',
        'Roboto',
        'Helvetica',
        'Arial',
        'sans-serif'
      ].join(','),
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transform: 'translateY(-1px)',
            },
          },
          contained: {
            background: 'linear-gradient(135deg, #FFD700 0%, #E6C200 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #E6C200 0%, #D4AF37 100%)',
            },
          },
          outlined: {
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'light'
              ? '0 2px 8px rgba(0,0,0,0.1)'
              : '0 2px 8px rgba(0,0,0,0.3)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '&:hover fieldset': {
                borderColor: '#FFD700',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FFD700',
              },
            },
            '& .MuiInputLabel-root': {
              fontWeight: 600,
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  })

  const cache = createCacheWithDirection(direction)

  return (
    <CacheProvider value={cache}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  )
}
