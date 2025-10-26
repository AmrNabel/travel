import { createTheme, ThemeOptions, alpha } from '@mui/material/styles';
import { Poppins } from 'next/font/google';

// Load Poppins font
export const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
});

// Color palette from design system
const colors = {
  primary: {
    main: '#38BDF8', // Sky Blue
    light: '#7DD3FC',
    dark: '#0284C7',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#F97316', // Orange Accent
    light: '#FB923C',
    dark: '#EA580C',
    contrastText: '#FFFFFF',
  },
  accent: {
    mint: '#10B981', // Mint Accent
    mintLight: '#34D399',
    mintDark: '#059669',
  },
  background: {
    default: '#F5F7F8',
    paper: '#FFFFFF',
    surface: '#FAFBFC',
  },
  text: {
    primary: '#374151',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
  },
  border: {
    light: '#E5E7EB',
    main: '#D1D5DB',
    dark: '#9CA3AF',
  },
};

// Dark mode colors
const darkColors = {
  background: {
    default: '#101C22',
    paper: '#1E293B',
    surface: '#293548',
  },
  text: {
    primary: '#E2E8F0',
    secondary: '#94A3B8',
    disabled: '#64748B',
  },
  border: {
    light: '#334155',
    main: '#475569',
    dark: '#64748B',
  },
};

// Create theme options
const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: colors.primary,
    secondary: colors.secondary,
    background: mode === 'light' ? colors.background : darkColors.background,
    text: mode === 'light' ? colors.text : darkColors.text,
    divider: mode === 'light' ? colors.border.light : darkColors.border.light,
    ...(mode === 'dark' && {
      action: {
        active: alpha('#FFFFFF', 0.56),
        hover: alpha('#FFFFFF', 0.08),
        selected: alpha('#FFFFFF', 0.16),
        disabled: alpha('#FFFFFF', 0.26),
        disabledBackground: alpha('#FFFFFF', 0.12),
      },
    }),
  },
  typography: {
    fontFamily: poppins.style.fontFamily,
    h1: {
      fontWeight: 900,
      fontSize: '3.5rem',
      lineHeight: 1.1,
      letterSpacing: '-0.033em',
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.015em',
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '-0.005em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0em',
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
    '0 6px 16px 0 rgba(0, 0, 0, 0.06)',
    '0 8px 24px 0 rgba(0, 0, 0, 0.07)',
    '0 10px 32px 0 rgba(0, 0, 0, 0.08)',
    '0 12px 40px 0 rgba(0, 0, 0, 0.09)',
    '0 16px 48px 0 rgba(0, 0, 0, 0.1)',
    '0 20px 56px 0 rgba(0, 0, 0, 0.11)',
    '0 24px 64px 0 rgba(0, 0, 0, 0.12)',
    '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
    '0 10px 30px -5px rgba(0, 0, 0, 0.15)',
    '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
    '0 10px 30px -5px rgba(0, 0, 0, 0.25)',
    '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
    '0 10px 30px -5px rgba(0, 0, 0, 0.35)',
    '0 10px 30px -5px rgba(0, 0, 0, 0.4)',
    '0 10px 30px -5px rgba(0, 0, 0, 0.45)',
    '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
    '0 10px 30px -5px rgba(0, 0, 0, 0.55)',
    '0 10px 30px -5px rgba(0, 0, 0, 0.6)',
    '0 10px 30px -5px rgba(0, 0, 0, 0.65)',
    '0 10px 30px -5px rgba(0, 0, 0, 0.7)',
    '0 10px 30px -5px rgba(0, 0, 0, 0.75)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor:
            mode === 'light' ? '#D1D5DB #F5F7F8' : '#475569 #1E293B',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: mode === 'light' ? '#D1D5DB' : '#475569',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: mode === 'light' ? '#F5F7F8' : '#1E293B',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          padding: '10px 24px',
          fontSize: '0.95rem',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.875rem',
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(56, 189, 248, 0.4)',
          },
        },
        containedSecondary: {
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(249, 115, 22, 0.4)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
      variants: [
        {
          props: { variant: 'gradient' as any },
          style: {
            background: 'linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%)',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px 0 rgba(56, 189, 248, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
              boxShadow: '0 6px 20px 0 rgba(56, 189, 248, 0.4)',
              transform: 'translateY(-2px)',
            },
          },
        },
        {
          props: { variant: 'orange' as any },
          style: {
            background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px 0 rgba(249, 115, 22, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
              boxShadow: '0 6px 20px 0 rgba(249, 115, 22, 0.4)',
              transform: 'translateY(-2px)',
            },
          },
        },
      ],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '16px',
        },
        elevation1: {
          boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
        },
        elevation3: {
          boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          border: `1px solid ${mode === 'light' ? colors.border.light : darkColors.border.light}`,
          boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.04)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px 0 rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor:
              mode === 'light' ? '#F9FAFB' : darkColors.background.surface,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: mode === 'light' ? '#F3F4F6' : '#334155',
            },
            '&.Mui-focused': {
              backgroundColor:
                mode === 'light' ? '#FFFFFF' : darkColors.background.paper,
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
                borderColor: colors.primary.main,
              },
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          '&.Mui-focused': {
            fontWeight: 600,
            color: colors.primary.main,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          minHeight: '48px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&.Mui-selected': {
            color: colors.primary.main,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backgroundColor:
            mode === 'light'
              ? colors.background.surface
              : darkColors.background.surface,
          padding: '4px',
        },
        indicator: {
          height: '100%',
          borderRadius: '8px',
          backgroundColor:
            mode === 'light' ? '#FFFFFF' : darkColors.background.paper,
          boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
          zIndex: -1,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          fontWeight: 500,
          fontSize: '0.875rem',
        },
        filled: {
          '&.MuiChip-colorPrimary': {
            backgroundColor: alpha(colors.primary.main, 0.15),
            color: colors.primary.dark,
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: alpha(colors.secondary.main, 0.15),
            color: colors.secondary.dark,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor:
            mode === 'light'
              ? alpha('#FFFFFF', 0.8)
              : alpha(darkColors.background.default, 0.8),
          backdropFilter: 'blur(8px)',
          boxShadow: `0 1px 0 ${mode === 'light' ? colors.border.light : darkColors.border.light}`,
          borderBottom: `1px solid ${mode === 'light' ? colors.border.light : darkColors.border.light}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor:
            mode === 'light' ? '#FFFFFF' : darkColors.background.paper,
          borderRight: `1px solid ${mode === 'light' ? colors.border.light : darkColors.border.light}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '20px',
          boxShadow: '0 20px 56px 0 rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: '1.5rem',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          height: '8px',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          animationDuration: '1s',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: alpha(colors.accent.mint, 0.1),
          color: colors.accent.mintDark,
        },
        standardInfo: {
          backgroundColor: alpha(colors.primary.main, 0.1),
          color: colors.primary.dark,
        },
        standardWarning: {
          backgroundColor: alpha(colors.secondary.main, 0.1),
          color: colors.secondary.dark,
        },
      },
    },
  },
});

// Create light and dark themes
export const lightTheme = createTheme(getThemeOptions('light'));
export const darkTheme = createTheme(getThemeOptions('dark'));

// Default export for the light theme
export default lightTheme;

// Custom colors for direct use in components
export const customColors = {
  ...colors,
  dark: darkColors,
};

// TypeScript module augmentation for custom variants
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    gradient: true;
    orange: true;
  }
}
