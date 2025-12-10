'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Container,
  InputAdornment,
  alpha,
  useTheme,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import { CreateRequestInput } from '@/types/request';
import { useRequests } from '@/hooks/useRequests';
import { useNotification } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import LuggageIcon from '@mui/icons-material/Luggage';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import ScaleIcon from '@mui/icons-material/Scale';
import CategoryIcon from '@mui/icons-material/Category';

export const RequestForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateRequestInput>({
    fromCity: '',
    toCity: '',
    itemType: '',
    weight: '',
    offerPrice: 0,
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stationNames, setStationNames] = useState<string[]>([]);
  const [stationsLoading, setStationsLoading] = useState(false);
  const [stationsError, setStationsError] = useState('');

  const { createRequest } = useRequests();
  const router = useRouter();
  const { showNotification } = useNotification();
  const { t, language } = useLanguage();
  const theme = useTheme();

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();
    const loadStations = async () => {
      setStationsLoading(true);
      setStationsError('');
      try {
        const filePath =
          language === 'ar-EG' ? '/stations-ar.json' : '/stations-en.json';
        const response = await fetch(filePath, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to load stations: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid stations format.');
        }
        if (!isActive) return;
        setStationNames(data);
      } catch (err) {
        if (!isActive || controller.signal.aborted) {
          return;
        }
        console.error(err);
        setStationsError(
          t('error.loadingStations', {
            defaultValue: 'Unable to load station list.',
          })
        );
        setStationNames([]);
      } finally {
        if (isActive) {
          setStationsLoading(false);
        }
      }
    };

    loadStations();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [language, t]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fromCity: '',
      toCity: '',
    }));
  }, [language]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'offerPrice' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createRequest(formData);
      showNotification(t('request.createSuccess'), 'success');
      router.push('/my-trips');
    } catch (err: unknown) {
      const error = err as { message?: string };
      const errorMsg = error.message || t('error.creatingRequest');
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
          {t('request.sendItem')}
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
          <Alert severity='info' sx={{ mb: 3, borderRadius: 2 }}>
            {t('request.offerPrerequisite')}
          </Alert>

          <Box component='form' onSubmit={handleSubmit}>
            {/* Route Section */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant='h5'
                gutterBottom
                fontWeight={700}
                sx={{ mb: 3 }}
              >
                {t('request.fromCity')} & {t('request.toCity')}
              </Typography>
              {stationsError && (
                <Alert severity='error' sx={{ mb: 2, borderRadius: 2 }}>
                  {stationsError}
                </Alert>
              )}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 3,
                }}
              >
                <Box
                  sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
                    minWidth: 0,
                  }}
                >
                  <Autocomplete
                    options={stationNames}
                    value={formData.fromCity || null}
                    onChange={(_, value) =>
                      setFormData((prev) => ({
                        ...prev,
                        fromCity: value ?? '',
                      }))
                    }
                    loading={stationsLoading}
                    autoHighlight
                    disablePortal
                    loadingText={t('common.loading', {
                      defaultValue: 'Loading...',
                    })}
                    noOptionsText={
                      stationsLoading
                        ? t('common.loading', { defaultValue: 'Loading...' })
                        : t('form.noStations', {
                            defaultValue: 'No stations found',
                          })
                    }
                    disabled={stationsLoading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('request.fromCity')}
                        placeholder={t('form.fromCityPlaceholder')}
                        required
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position='start'>
                                <FlightTakeoffIcon
                                  sx={{ color: 'text.secondary' }}
                                />
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                          endAdornment: (
                            <>
                              {stationsLoading && (
                                <CircularProgress
                                  color='inherit'
                                  size={18}
                                  sx={{ mr: 1 }}
                                />
                              )}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Box>

                <Box
                  sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
                    minWidth: 0,
                  }}
                >
                  <Autocomplete
                    options={stationNames}
                    value={formData.toCity || null}
                    onChange={(_, value) =>
                      setFormData((prev) => ({
                        ...prev,
                        toCity: value ?? '',
                      }))
                    }
                    loading={stationsLoading}
                    autoHighlight
                    disablePortal
                    loadingText={t('common.loading', {
                      defaultValue: 'Loading...',
                    })}
                    noOptionsText={
                      stationsLoading
                        ? t('common.loading', { defaultValue: 'Loading...' })
                        : t('form.noStations', {
                            defaultValue: 'No stations found',
                          })
                    }
                    disabled={stationsLoading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('request.toCity')}
                        placeholder={t('form.toCityPlaceholder')}
                        required
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position='start'>
                                <FlightLandIcon
                                  sx={{ color: 'text.secondary' }}
                                />
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                          endAdornment: (
                            <>
                              {stationsLoading && (
                                <CircularProgress
                                  color='inherit'
                                  size={18}
                                  sx={{ mr: 1 }}
                                />
                              )}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>
            </Box>

            {/* Item Details Section */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant='h5'
                gutterBottom
                fontWeight={700}
                sx={{ mb: 3 }}
              >
                {t('request.itemType')} & {t('request.weight')}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 3,
                }}
              >
                <Box
                  sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
                    minWidth: 0,
                  }}
                >
                  <TextField
                    label={t('request.itemType')}
                    name='itemType'
                    value={formData.itemType}
                    onChange={handleChange}
                    fullWidth
                    required
                    helperText={t('form.itemTypePlaceholder')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <CategoryIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
                    minWidth: 0,
                  }}
                >
                  <TextField
                    label={t('request.weight')}
                    name='weight'
                    value={formData.weight}
                    onChange={handleChange}
                    fullWidth
                    required
                    helperText={t('form.weightPlaceholder')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <ScaleIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Price Section */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant='h5'
                gutterBottom
                fontWeight={700}
                sx={{ mb: 3 }}
              >
                {t('request.offerPrice')}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 3,
                }}
              >
                <Box
                  sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
                    minWidth: 0,
                  }}
                >
                  <TextField
                    label={t('request.offerPrice')}
                    name='offerPrice'
                    type='number'
                    value={formData.offerPrice}
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
                            EGP
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
                </Box>
              </Box>
            </Box>

            {/* Description Section */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant='h5'
                gutterBottom
                fontWeight={700}
                sx={{ mb: 3 }}
              >
                {t('request.description')} ({t('form.optional')})
              </Typography>
              <TextField
                label={t('request.description')}
                name='description'
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                placeholder={t('form.descriptionPlaceholder')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position='start'
                      sx={{ alignSelf: 'flex-start', mt: 1 }}
                    >
                      <DescriptionIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
              <Button
                type='submit'
                variant='orange'
                size='large'
                disabled={loading}
                sx={{
                  px: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                {loading ? (
                  <CircularProgress size={20} color='inherit' />
                ) : (
                  <LuggageIcon />
                )}
                {loading ? `${t('common.loading')}...` : t('request.sendItem')}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
