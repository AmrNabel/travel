'use client';

import { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { lightTheme } from '@/theme/theme';
import { SEOUpdater } from '@/components/common/SEOUpdater';

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { direction } = useLanguage();

  const theme = useMemo(
    () =>
      createTheme({
        ...lightTheme,
        direction,
      }),
    [direction]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SEOUpdater />
      {children}
    </ThemeProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeWrapper>
        <NotificationProvider>
          <AuthProvider>{children}</AuthProvider>
        </NotificationProvider>
      </ThemeWrapper>
    </LanguageProvider>
  );
}
