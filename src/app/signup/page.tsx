'use client';

import { SignupForm } from '@/components/auth/SignupForm';
import { Box, alpha, useTheme } from '@mui/material';

export default function SignupPage() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        py: 4,
      }}
    >
      <SignupForm />
    </Box>
  );
}
