'use client';

import { SignupForm } from '@/components/auth/SignupForm';
import { Container } from '@mui/material';

export default function SignupPage() {
  return (
    <Container maxWidth='sm'>
      <SignupForm />
    </Container>
  );
}
