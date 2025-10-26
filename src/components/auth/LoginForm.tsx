'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/');
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}
    >
      <Typography variant='h4' component='h1' gutterBottom>
        Sign In
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label='Email'
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        margin='normal'
      />

      <TextField
        label='Password'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        margin='normal'
      />

      <Button
        type='submit'
        variant='contained'
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <Typography variant='body2' sx={{ mt: 2, textAlign: 'center' }}>
        Don&apos;t have an account?{' '}
        <Link href='/signup' passHref legacyBehavior>
          <MuiLink>Sign Up</MuiLink>
        </Link>
      </Typography>
    </Box>
  );
};
