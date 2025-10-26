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
} from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';

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

  const { signUp } = useAuth();
  const router = useRouter();

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

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}
    >
      <Typography variant='h4' component='h1' gutterBottom>
        Sign Up
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label='Full Name'
        name='name'
        value={formData.name}
        onChange={handleChange}
        fullWidth
        required
        margin='normal'
      />

      <TextField
        label='Email'
        name='email'
        type='email'
        value={formData.email}
        onChange={handleChange}
        fullWidth
        required
        margin='normal'
      />

      <TextField
        label='Phone (Optional)'
        name='phone'
        type='tel'
        value={formData.phone}
        onChange={handleChange}
        fullWidth
        margin='normal'
      />

      <FormControl component='fieldset' sx={{ mt: 2 }}>
        <FormLabel component='legend'>I want to:</FormLabel>
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

      <TextField
        label='Password'
        name='password'
        type='password'
        value={formData.password}
        onChange={handleChange}
        fullWidth
        required
        margin='normal'
        helperText='At least 6 characters'
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
      />

      <Button
        type='submit'
        variant='contained'
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </Button>

      <Typography variant='body2' sx={{ mt: 2, textAlign: 'center' }}>
        Already have an account?{' '}
        <Link href='/login' passHref legacyBehavior>
          <MuiLink>Sign In</MuiLink>
        </Link>
      </Typography>
    </Box>
  );
};
