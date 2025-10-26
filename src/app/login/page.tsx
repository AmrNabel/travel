'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { Container } from '@mui/material';

export default function LoginPage() {
  return (
    <Container maxWidth='sm'>
      <LoginForm />
    </Container>
  );
}
