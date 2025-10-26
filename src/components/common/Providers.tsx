'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from '@/contexts/AuthContext';
import { lightTheme } from '@/theme/theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
