'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { TripForm } from '@/components/trips/TripForm';
import { NavBar } from '@/components/common/NavBar';
import { Box, Container } from '@mui/material';

export default function AddTripPage() {
  return (
    <AuthGuard>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <NavBar />
        <Container maxWidth='md' sx={{ py: 4 }}>
          <TripForm />
        </Container>
      </Box>
    </AuthGuard>
  );
}
