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
  AppBar,
  Toolbar,
  Avatar,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  alpha,
  useTheme,
} from '@mui/material';
import { CreateTripInput } from '@/types/trip';
import { useTrips } from '@/hooks/useTrips';
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
  const router = useRouter();
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
      router.push(`/search`);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position='sticky' elevation={0}>
        <Toolbar sx={{ py: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexGrow: 1,
            }}
          >
            <FlightTakeoffIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography
              variant='h6'
              component='div'
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              CarryOn
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Button
              color='inherit'
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Find Items
            </Button>
            <Button
              color='inherit'
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              My Trips
            </Button>
            <Button
              color='inherit'
              sx={{ color: 'primary.main', fontWeight: 600 }}
            >
              Add Trip
            </Button>
            <Button
              color='inherit'
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Messages
            </Button>
          </Box>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              ml: 2,
              cursor: 'pointer',
              border: 2,
              borderColor: 'divider',
            }}
            src='https://i.pravatar.cc/150?img=1'
          />
        </Toolbar>
      </AppBar>

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
          Share Your Travel Route
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
                Where are you going?
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label='From'
                    name='fromCity'
                    placeholder='Origin City'
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
                    label='To'
                    name='toCity'
                    placeholder='Destination City'
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
                When are you traveling?
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label='Arrival Date'
                    name='date'
                    type='date'
                    placeholder='Select date'
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
                What&apos;s your capacity and price?
              </Typography>
              <Grid container spacing={3} alignItems='flex-end'>
                <Grid item xs={12} md={6}>
                  <Typography variant='body1' fontWeight={600} sx={{ mb: 2 }}>
                    Available Space
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
                          Small
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
                          Medium
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
                          Large
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label='Your Price'
                    name='pricePerKg'
                    type='number'
                    placeholder='0.00'
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
                label='Additional Notes (Optional)'
                name='description'
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                placeholder='Any additional information about your trip...'
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
                {loading ? 'Posting...' : 'Post a Trip ✈️'}
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
          &quot;The world is a book and those who do not travel read only one
          page.&quot; - Saint Augustine
        </Typography>
      </Box>
    </Box>
  );
};
