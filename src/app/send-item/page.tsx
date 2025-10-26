'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { RequestForm } from '@/components/requests/RequestForm';
import { NavBar } from '@/components/common/NavBar';
import { Container, Box } from '@mui/material';

export default function SendItemPage() {
  return (
    <AuthGuard>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <NavBar />
        <Container maxWidth='md' sx={{ py: 4 }}>
          <RequestForm />
        </Container>
      </Box>
    </AuthGuard>
  );
}
