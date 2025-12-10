'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  useTheme,
  alpha,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotification } from '@/contexts/NotificationContext';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';

export default function ContactUsPage() {
  const { t } = useLanguage();
  const { showNotification } = useNotification();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const errorMessage = data.error || t('contactUs.form.error');
        throw new Error(errorMessage);
      }

      setSuccess(true);
      showNotification(t('contactUs.form.success'), 'success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t('contactUs.form.error');
      setError(message);
      showNotification(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      key: 'email',
      icon: EmailIcon,
      label: t('contactUs.email.label'),
      value: t('contactUs.email.value'),
    },
    {
      key: 'phone',
      icon: PhoneIcon,
      label: t('contactUs.phone.label'),
      value: t('contactUs.phone.value'),
    },
    {
      key: 'address',
      icon: LocationOnIcon,
      label: t('contactUs.address.label'),
      value: t('contactUs.address.value'),
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      }}
    >
      <Container maxWidth='lg' sx={{ py: 6, flex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <EmailIcon
            sx={{
              fontSize: 60,
              color: 'primary.main',
              mb: 2,
            }}
          />
          <Typography
            variant='h3'
            component='h1'
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            {t('contactUs.title')}
          </Typography>
          <Typography
            variant='h6'
            color='text.secondary'
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            {t('contactUs.subtitle')}
          </Typography>
          <Typography
            variant='body1'
            color='text.secondary'
            sx={{ maxWidth: 700, mx: 'auto', mt: 2 }}
          >
            {t('contactUs.description')}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
          }}
        >
          {/* Contact Information */}
          <Box
            sx={{
              flex: { xs: '1 1 100%', md: '0 0 calc(33.333% - 16px)' },
              minWidth: 0,
            }}
          >
            <Box sx={{ mb: 4 }}>
              {contactInfo.map((info) => {
                const IconComponent = info.icon;
                return (
                  <Card
                    key={info.key}
                    sx={{
                      mb: 2,
                      borderRadius: 3,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <IconComponent
                          sx={{
                            fontSize: 30,
                            color: 'primary.main',
                          }}
                        />
                        <Box>
                          <Typography variant='caption' color='text.secondary'>
                            {info.label}
                          </Typography>
                          <Typography variant='body1' sx={{ fontWeight: 500 }}>
                            {info.value}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>

            {/* Support Hours */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
              >
                <AccessTimeIcon
                  sx={{
                    fontSize: 30,
                    color: 'primary.main',
                  }}
                />
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  {t('contactUs.hours.title')}
                </Typography>
              </Box>
              <Typography variant='body2' color='text.secondary'>
                {t('contactUs.hours.description')}
              </Typography>
            </Paper>
          </Box>

          {/* Contact Form */}
          <Box
            sx={{
              flex: { xs: '1 1 100%', md: '1 1 calc(66.666% - 16px)' },
              minWidth: 0,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
              }}
            >
              <Typography
                variant='h5'
                gutterBottom
                sx={{ fontWeight: 600, mb: 3 }}
              >
                {t('contactUs.form.title')}
              </Typography>

              {success && (
                <Alert severity='success' sx={{ mb: 3 }}>
                  {t('contactUs.form.success')}
                </Alert>
              )}

              {error && (
                <Alert severity='error' sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component='form' onSubmit={handleSubmit}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                  }}
                >
                  <Box
                    sx={{
                      flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' },
                      minWidth: 0,
                    }}
                  >
                    <TextField
                      fullWidth
                      label={t('contactUs.form.name')}
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      required
                      variant='outlined'
                    />
                  </Box>
                  <Box
                    sx={{
                      flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' },
                      minWidth: 0,
                    }}
                  >
                    <TextField
                      fullWidth
                      label={t('contactUs.form.email')}
                      name='email'
                      type='email'
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant='outlined'
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 100%' }}>
                    <TextField
                      fullWidth
                      label={t('contactUs.form.subject')}
                      name='subject'
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      variant='outlined'
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 100%' }}>
                    <TextField
                      fullWidth
                      label={t('contactUs.form.message')}
                      name='message'
                      value={formData.message}
                      onChange={handleChange}
                      required
                      multiline
                      rows={6}
                      variant='outlined'
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 100%' }}>
                    <Button
                      type='submit'
                      variant='contained'
                      size='large'
                      disabled={loading}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={20} color='inherit' />
                      ) : (
                        <SendIcon />
                      )}
                      {loading
                        ? t('contactUs.form.sending')
                        : t('contactUs.form.send')}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
