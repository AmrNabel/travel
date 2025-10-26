'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { TripForm } from '@/components/trips/TripForm';
import { Container } from '@mui/material';

export default function AddTripPage() {
  return (
    <AuthGuard>
      <Container maxWidth='md'>
        <TripForm />
      </Container>
    </AuthGuard>
  );
}
