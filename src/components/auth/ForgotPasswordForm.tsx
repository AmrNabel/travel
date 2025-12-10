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
  alpha,
  useTheme,
  InputAdornment,
} from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import EmailIcon from '@mui/icons-material/Email';

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || t('auth.resetPasswordError'));
    } finally {
      setLoading(false);
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
          {t('auth.forgotPassword')}
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          {t('auth.forgotPasswordDesc')}
        </Typography>
      </Box>

      {/* Success Message */}
      {success && (
        <Alert severity='success' sx={{ mb: 3, borderRadius: 2 }}>
          {t('auth.resetPasswordSuccess')}
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity='error' sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Form */}
      {!success ? (
        <Box component='form' onSubmit={handleSubmit}>
          <TextField
            label={t('auth.email')}
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin='normal'
            placeholder='your@email.com'
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <EmailIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type='submit'
            variant='gradient'
            fullWidth
            disabled={loading}
            size='large'
            sx={{ py: 1.5, mb: 2 }}
          >
            {loading ? `${t('common.loading')}...` : t('auth.sendResetLink')}
          </Button>

          {/* Links */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant='body2' color='text.secondary'>
              {t('auth.rememberPassword')}{' '}
              <Link href='/login' passHref legacyBehavior>
                <MuiLink
                  sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {t('auth.login')}
                </MuiLink>
              </Link>
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
            {t('auth.checkEmailInstructions')}
          </Typography>
          <Button
            variant='outlined'
            fullWidth
            onClick={() => router.push('/login')}
            sx={{ py: 1.5 }}
          >
            {t('auth.backToLogin')}
          </Button>
        </Box>
      )}
    </Paper>
  );
};
