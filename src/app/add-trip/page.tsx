'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { TripForm } from '@/components/trips/TripForm';
import { Box, alpha, useTheme } from '@mui/material';

export default function AddTripPage() {
  const theme = useTheme();

  return (
    <AuthGuard>
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
          py: 4,
        }}
      >
        <TripForm />
      </Box>
    </AuthGuard>
  );
}
