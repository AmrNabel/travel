'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  Paper,
  Container,
  InputAdornment,
  alpha,
  useTheme,
} from '@mui/material';
import { CreateTripInput } from '@/types/trip';
import { useTrips } from '@/hooks/useTrips';
import { useNotification } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { NavBar } from '@/components/common/NavBar';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LuggageIcon from '@mui/icons-material/Luggage';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export const TripForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateTripInput>({
    fromCity: '',
    toCity: '',
    date: new Date(),
    capacity: 'Small',
    pricePerKg: 0,
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<
    'Small' | 'Medium' | 'Large'
  >('Small');

  const { createTrip } = useTrips();
  const { t } = useLanguage();
  const router = useRouter();
  const { showNotification } = useNotification();
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'pricePerKg' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createTrip({ ...formData, capacity: selectedSize });
      showNotification(t('trip.createSuccess'), 'success');
      router.push('/my-trips');
    } catch (err: unknown) {
      const error = err as { message?: string };
      const errorMsg = error.message || t('error.creatingTrip');
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      

      {/* Main Content */}
      <Container maxWidth='md' sx={{ flexGrow: 1, py: { xs: 4, md: 8 } }}>
        <Typography
          variant='h3'
          component='h1'
          align='center'
          gutterBottom
          fontWeight={900}
          sx={{ mb: 6, fontSize: { xs: '2rem', md: '2.5rem' } }}
        >
          {t('trip.postTrip')}
        </Typography>

        <Paper
          elevation={11}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 4,
            border: 1,
            borderColor: 'divider',
          }}
        >
          {error && (
            <Alert severity='error' sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component='form' onSubmit={handleSubmit}>
            {/* Route Section */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant='h5'
                gutterBottom
                fontWeight={700}
                sx={{ mb: 3 }}
              >
                {t('trip.fromCity')} & {t('trip.toCity')}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label={t('trip.fromCity')}
                    name='fromCity'
                    placeholder={t('form.fromCityPlaceholder')}
                    value={formData.fromCity}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <FlightTakeoffIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label={t('trip.toCity')}
                    name='toCity'
                    placeholder={t('form.toCityPlaceholder')}
                    value={formData.toCity}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <FlightLandIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Date Section */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant='h5'
                gutterBottom
                fontWeight={700}
                sx={{ mb: 3 }}
              >
                {t('form.dateLabel')}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label={t('trip.date')}
                    name='date'
                    type='date'
                    value={formData.date.toISOString().split('T')[0]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        date: new Date(e.target.value),
                      }))
                    }
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <CalendarMonthIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Capacity & Price Section */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant='h5'
                gutterBottom
                fontWeight={700}
                sx={{ mb: 3 }}
              >
                {t('trip.capacity')} & {t('trip.pricePerKg')}
              </Typography>
              <Grid container spacing={3} alignItems='flex-end'>
                <Grid item xs={12} md={6}>
                  <Typography variant='body1' fontWeight={600} sx={{ mb: 2 }}>
                    {t('form.capacityLabel')}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Paper
                        elevation={selectedSize === 'Small' ? 8 : 1}
                        onClick={() => setSelectedSize('Small')}
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          cursor: 'pointer',
                          border: 2,
                          borderColor:
                            selectedSize === 'Small'
                              ? 'primary.main'
                              : 'transparent',
                          bgcolor:
                            selectedSize === 'Small'
                              ? alpha(theme.palette.primary.main, 0.15)
                              : 'transparent',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <LuggageIcon
                          sx={{
                            fontSize: 32,
                            color:
                              selectedSize === 'Small'
                                ? 'primary.main'
                                : 'text.secondary',
                            mb: 1,
                          }}
                        />
                        <Typography variant='body2' fontWeight={600}>
                          {t('search.small')}
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={4}>
                      <Paper
                        elevation={selectedSize === 'Medium' ? 8 : 1}
                        onClick={() => setSelectedSize('Medium')}
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          cursor: 'pointer',
                          border: 2,
                          borderColor:
                            selectedSize === 'Medium'
                              ? 'primary.main'
                              : 'transparent',
                          bgcolor:
                            selectedSize === 'Medium'
                              ? alpha(theme.palette.primary.main, 0.15)
                              : 'transparent',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <BusinessCenterIcon
                          sx={{
                            fontSize: 32,
                            color:
                              selectedSize === 'Medium'
                                ? 'primary.main'
                                : 'text.secondary',
                            mb: 1,
                          }}
                        />
                        <Typography variant='body2' fontWeight={600}>
                          {t('search.medium')}
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={4}>
                      <Paper
                        elevation={selectedSize === 'Large' ? 8 : 1}
                        onClick={() => setSelectedSize('Large')}
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          cursor: 'pointer',
                          border: 2,
                          borderColor:
                            selectedSize === 'Large'
                              ? 'primary.main'
                              : 'transparent',
                          bgcolor:
                            selectedSize === 'Large'
                              ? alpha(theme.palette.primary.main, 0.15)
                              : 'transparent',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <MoveToInboxIcon
                          sx={{
                            fontSize: 32,
                            color:
                              selectedSize === 'Large'
                                ? 'primary.main'
                                : 'text.secondary',
                            mb: 1,
                          }}
                        />
                        <Typography variant='body2' fontWeight={600}>
                          {t('search.large')}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label={t('form.pricePerKgLabel')}
                    name='pricePerKg'
                    type='number'
                    placeholder={t('form.pricePerKgPlaceholder')}
                    value={formData.pricePerKg}
                    onChange={handleChange}
                    fullWidth
                    required
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <AttachMoneyIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            fontWeight={600}
                          >
                            USD
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'secondary.main',
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Description (Optional) */}
            <Box sx={{ mb: 4 }}>
              <TextField
                label={`${t('trip.description')} (${t('form.optional')})`}
                name='description'
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                placeholder={t('form.descriptionPlaceholder')}
              />
            </Box>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
              <Button
                type='submit'
                variant='orange'
                size='large'
                disabled={loading}
                startIcon={<FlightTakeoffIcon />}
                sx={{ px: 6 }}
              >
                {loading ? `${t('common.loading')}...` : t('nav.postTrip')}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        component='footer'
        sx={{
          py: 4,
          textAlign: 'center',
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          mt: 'auto',
        }}
      >
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ fontStyle: 'italic' }}
        >
          &quot;{t('home.footer.quote')}&quot; - {t('home.footer.author')}
        </Typography>
      </Box>
    </Box>
  );
};
