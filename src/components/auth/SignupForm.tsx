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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  alpha,
  useTheme,
  Checkbox,
} from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

export const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'both' as UserRole,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.role,
      });

      router.push('/');
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: 'login' | 'signup' | null
  ) => {
    if (newMode !== null) {
      if (newMode === 'login') {
        router.push('/login');
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

      {/* Signup Form */}
      <Box component='form' onSubmit={handleSubmit}>
        <TextField
          label='Full Name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          margin='normal'
          placeholder='Jane Doe 👋'
          sx={{ mb: 2 }}
        />

        <TextField
          label='Email Address'
          name='email'
          type='email'
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          margin='normal'
          placeholder='your@email.com ✉️'
          sx={{ mb: 2 }}
        />

        <TextField
          label='Phone Number'
          name='phone'
          type='tel'
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          required
          margin='normal'
          placeholder='+1 (555) 123-4567 📱'
          sx={{ mb: 2 }}
        />

        <TextField
          label='Password'
          name='password'
          type='password'
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
          margin='normal'
          placeholder='•••••••• 🔒'
          helperText='At least 6 characters'
          sx={{ mb: 2 }}
        />

        <TextField
          label='Confirm Password'
          name='confirmPassword'
          type='password'
          value={formData.confirmPassword}
          onChange={handleChange}
          fullWidth
          required
          margin='normal'
          placeholder='•••••••• 🔒'
          sx={{ mb: 2 }}
        />

        <FormControl component='fieldset' sx={{ mb: 2, width: '100%' }}>
          <FormLabel component='legend' sx={{ mb: 1, fontWeight: 600 }}>
            I want to:
          </FormLabel>
          <RadioGroup name='role' value={formData.role} onChange={handleChange}>
            <FormControlLabel
              value='traveler'
              control={<Radio />}
              label='Deliver items as a traveler'
            />
            <FormControlLabel
              value='sender'
              control={<Radio />}
              label='Send items with travelers'
            />
            <FormControlLabel value='both' control={<Radio />} label='Both' />
          </RadioGroup>
        </FormControl>

        {/* Terms Checkbox */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
          <Checkbox
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            sx={{ mt: -1 }}
          />
          <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
            I agree to the{' '}
            <MuiLink
              href='#'
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Terms of Service
            </MuiLink>{' '}
            &{' '}
            <MuiLink
              href='#'
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Privacy Policy
            </MuiLink>
            .
          </Typography>
        </Box>

        <Button
          type='submit'
          variant='gradient'
          fullWidth
          disabled={loading}
          size='large'
          sx={{ py: 1.5, mb: 2 }}
        >
          {loading ? 'Creating Account...' : 'Create My Account'}
        </Button>

        {/* Links */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant='body2' color='text.secondary'>
            Already have an account?{' '}
            <Link href='/login' passHref legacyBehavior>
              <MuiLink
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Log In
              </MuiLink>
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
