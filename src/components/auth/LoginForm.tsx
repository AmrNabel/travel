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
  Paper,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  alpha,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const { signIn } = useAuth();
  const router = useRouter();
  const theme = useTheme();

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

  const handleAuthModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: 'login' | 'signup' | null
  ) => {
    if (newMode !== null) {
      if (newMode === 'signup') {
        router.push('/signup');
      } else {
        setAuthMode(newMode);
      }
    }
  };

  return (
    <Paper
      elevation={11}
      sx={{
        maxWidth: 480,
        width: '100%',
        mx: 'auto',
        p: { xs: 3, sm: 4 },
        borderRadius: 4,
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <FlightTakeoffIcon
          sx={{ fontSize: 48, color: 'primary.main', mb: 1 }}
        />
        <Typography variant='h4' component='h1' gutterBottom fontWeight={800}>
          Welcome aboard! 🚀
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Join our community of travelers and senders.
        </Typography>
      </Box>

      {/* Toggle Between Login/Signup */}
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={authMode}
          exclusive
          onChange={handleAuthModeChange}
          fullWidth
          sx={{
            bgcolor: 'background.default',
            p: 0.5,
            borderRadius: 2,
            '& .MuiToggleButton-root': {
              border: 'none',
              borderRadius: 1.5,
              py: 1.5,
              fontWeight: 600,
              '&.Mui-selected': {
                bgcolor: 'background.paper',
                boxShadow: theme.shadows[2],
                '&:hover': {
                  bgcolor: 'background.paper',
                },
              },
            },
          }}
        >
          <ToggleButton value='signup'>Sign Up</ToggleButton>
          <ToggleButton value='login'>Log In</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Social Login Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Button
          variant='outlined'
          fullWidth
          startIcon={<GoogleIcon />}
          sx={{
            py: 1.5,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
            },
          }}
        >
          Continue with Google
        </Button>
        <Button
          variant='outlined'
          fullWidth
          startIcon={<FacebookIcon />}
          sx={{
            py: 1.5,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
            },
          }}
        >
          Continue with Facebook
        </Button>
      </Box>

      {/* Divider */}
      <Divider sx={{ my: 3 }}>
        <Typography variant='body2' color='text.secondary' fontWeight={600}>
          OR
        </Typography>
      </Divider>

      {/* Error Alert */}
      {error && (
        <Alert severity='error' sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Login Form */}
      <Box component='form' onSubmit={handleSubmit}>
        <TextField
          label='Email Address'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          margin='normal'
          placeholder='your@email.com ✉️'
          sx={{ mb: 2 }}
        />

        <TextField
          label='Password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          margin='normal'
          placeholder='•••••••• 🔒'
          sx={{ mb: 3 }}
        />

        <Button
          type='submit'
          variant='gradient'
          fullWidth
          disabled={loading}
          size='large'
          sx={{ py: 1.5, mb: 2 }}
        >
          {loading ? 'Signing in...' : 'Sign In to My Account'}
        </Button>

        {/* Links */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
            Don&apos;t have an account?{' '}
            <Link href='/signup' passHref legacyBehavior>
              <MuiLink
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Sign Up
              </MuiLink>
            </Link>
          </Typography>
          <MuiLink
            href='#'
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              textDecoration: 'none',
              fontSize: '0.875rem',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Forgot your password?
          </MuiLink>
        </Box>
      </Box>
    </Paper>
  );
};
