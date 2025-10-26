'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { RequestForm } from '@/components/requests/RequestForm';
import { Container } from '@mui/material';

export default function SendItemPage() {
  return (
    <AuthGuard>
      <Container maxWidth='md'>
        <RequestForm />
      </Container>
    </AuthGuard>
  );
}
