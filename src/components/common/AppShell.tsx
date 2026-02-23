'use client';

import { Box } from '@mui/material';
import { NavBar } from '@/components/common/NavBar';
import { SiteFooter } from '@/components/common/SiteFooter';

interface AppShellProps {
  children: React.ReactNode;
  initialUser?: {
    id: string;
    name: string;
    email: string | null;
    photoURL?: string | null;
  } | null;
}

export const AppShell = ({ children, initialUser }: AppShellProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        overflowX: 'hidden',
        width: '100%',
        maxWidth: '100vw',
      }}
    >
      <NavBar initialUser={initialUser ?? null} />
      <Box
        component='main'
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
        }}
      >
        {children}
      </Box>
      <SiteFooter />
    </Box>
  );
};
