'use client';

import { useEffect, useRef, useState } from 'react';
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
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import { CreateTripInput } from '@/types/trip';
import { useTrips } from '@/hooks/useTrips';
import { useNotification } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LuggageIcon from '@mui/icons-material/Luggage';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrainIcon from '@mui/icons-material/Train';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

type TrainStation = {
  stationId: number | string;
  stationName: {
    en?: string;
    ar?: string;
  };
  arrivalTime: string | null;
  departureTime: string | null;
};

type TrainSchedule = {
  startTime?: string;
  stations: TrainStation[];
};

type TrainData = {
  trainNumber?: string;
  schedule?: TrainSchedule;
};

export const TripForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateTripInput>({
    fromCity: '',
    toCity: '',
    date: new Date(),
    capacity: 'Small',
    pricePerKg: 50,
    description: '',
    trainNumber: '',
    departureTime: '',
  });
  const [error, setError] = useState('');
  const [stationNames, setStationNames] = useState<string[]>([]);
  const [stationsLoading, setStationsLoading] = useState(false);
  const [stationsError, setStationsError] = useState('');
  const [trainData, setTrainData] = useState<TrainData | null>(null);
  const [trainLoading, setTrainLoading] = useState(false);
  const [trainError, setTrainError] = useState('');
  const [trainValidationError, setTrainValidationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<
    'Small' | 'Medium' | 'Large'
  >('Small');
  const lastAutoDepartureRef = useRef<string>('');
  const previousFromCityRef = useRef<string>('');

  const { createTrip } = useTrips();
  const { t, language } = useLanguage();
  const router = useRouter();
  const { showNotification } = useNotification();
  const theme = useTheme();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'pricePerKg' ? parseFloat(value) || 0 : value,
    }));
  };

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
      departureTime: '',
    }));
    setTrainValidationError('');
    setTrainError('');
    lastAutoDepartureRef.current = '';
    previousFromCityRef.current = '';
  }, [language]);

  useEffect(() => {
    const rawTrainNumber = formData.trainNumber?.trim() ?? '';
    if (!rawTrainNumber) {
      setTrainData(null);
      setTrainError('');
      setTrainValidationError('');
      setTrainLoading(false);
      return;
    }

    let isActive = true;
    const controller = new AbortController();
    const loadTrain = async () => {
      setTrainLoading(true);
      setTrainError('');
      try {
        const normalized = rawTrainNumber.replace(/\s+/g, '');
        const filePath = `/trains/train-${normalized}.json`;
        const response = await fetch(filePath, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to load train ${normalized}`);
        }
        const data = await response.json();
        if (!isActive) return;
        const stations = data?.schedule?.stations;
        if (!stations || !Array.isArray(stations) || stations.length === 0) {
          throw new Error(`Train ${normalized} has no station data.`);
        }
        setTrainData({
          trainNumber: data.trainNumber ?? normalized,
          schedule: {
            startTime: data?.schedule?.startTime,
            stations,
          },
        });
      } catch (err) {
        if (!isActive || controller.signal.aborted) {
          return;
        }
        console.error(err);
        setTrainData(null);
        setTrainError(
          t('error.loadingTrain', {
            defaultValue:
              'Unable to load train schedule. Please verify the number.',
          })
        );
      } finally {
        if (isActive) {
          setTrainLoading(false);
        }
      }
    };

    loadTrain();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [formData.trainNumber, t]);

  useEffect(() => {
    if (!formData.trainNumber?.trim()) {
      setTrainValidationError('');
      return;
    }

    const stations = trainData?.schedule?.stations ?? [];
    if (!trainData || stations.length === 0) {
      if (trainError) {
        setTrainValidationError(trainError);
      }
      return;
    }

    const langKey = language === 'ar-EG' ? 'ar' : 'en';
    const normalize = (value?: string | null) =>
      (value ?? '').trim().toLowerCase();

    const findStation = (city: string | undefined) => {
      if (!city) return null;
      const normalizedCity = normalize(city);
      return stations.find((station) => {
        const possibleNames = [
          station.stationName?.[langKey],
          station.stationName?.en,
          station.stationName?.ar,
        ].filter(Boolean) as string[];
        return possibleNames.some((name) => normalize(name) === normalizedCity);
      });
    };

    const currentFromCity = formData.fromCity ?? '';
    const fromCityChanged = previousFromCityRef.current !== currentFromCity;
    const fromStop = findStation(formData.fromCity);
    const toStop = findStation(formData.toCity);

    if (formData.fromCity && !fromStop) {
      setTrainValidationError(
        t('validation.trainMissingStation', {
          defaultValue:
            'Selected train does not stop at the chosen departure station.',
          station: formData.fromCity,
          train: formData.trainNumber,
        })
      );
      previousFromCityRef.current = currentFromCity;
      return;
    }

    if (formData.toCity && !toStop) {
      setTrainValidationError(
        t('validation.trainMissingStation', {
          defaultValue:
            'Selected train does not stop at the chosen arrival station.',
          station: formData.toCity,
          train: formData.trainNumber,
        })
      );
      previousFromCityRef.current = currentFromCity;
      return;
    }

    if (fromStop && toStop) {
      const fromIndex = stations.indexOf(fromStop);
      const toIndex = stations.indexOf(toStop);

      if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
        setTrainValidationError(
          t('validation.trainOrderInvalid', {
            defaultValue:
              'Selected train does not travel from the chosen departure station to the arrival station in this order.',
            from: formData.fromCity,
            to: formData.toCity,
            train: formData.trainNumber,
          })
        );
        previousFromCityRef.current = currentFromCity;
        return;
      }

      const preferredDeparture =
        fromStop.departureTime ??
        fromStop.arrivalTime ??
        trainData.schedule?.startTime ??
        '';

      if (preferredDeparture) {
        const shouldAutoUpdate =
          fromCityChanged ||
          formData.departureTime === '' ||
          formData.departureTime === lastAutoDepartureRef.current;

        if (shouldAutoUpdate && formData.departureTime !== preferredDeparture) {
          setFormData((prev) => ({
            ...prev,
            departureTime: preferredDeparture,
          }));
        }

        lastAutoDepartureRef.current = preferredDeparture;
      } else {
        lastAutoDepartureRef.current = '';
      }
    }

    setTrainValidationError('');
    previousFromCityRef.current = currentFromCity;
  }, [
    formData.departureTime,
    formData.fromCity,
    formData.toCity,
    formData.trainNumber,
    language,
    t,
    trainData,
    trainError,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (trainError) {
      setError(trainError);
      setLoading(false);
      return;
    }

    if (trainValidationError) {
      setError(trainValidationError);
      setLoading(false);
      return;
    }

    try {
      const payload: CreateTripInput = {
        ...formData,
        trainNumber: formData.trainNumber?.trim(),
        departureTime: formData.departureTime?.trim(),
        capacity: selectedSize,
      };

      await createTrip(payload);
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
              {stationsError && (
                <Alert severity='error' sx={{ mb: 2, borderRadius: 2 }}>
                  {stationsError}
                </Alert>
              )}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
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
                        label={t('trip.fromCity')}
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
                </Grid>

                <Grid item xs={12} md={6}>
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
                        label={t('trip.toCity')}
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
                </Grid>
              </Grid>
            </Box>

            {/* Train Details */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant='h5'
                gutterBottom
                fontWeight={700}
                sx={{ mb: 3 }}
              >
                {t('trip.trainDetails', { defaultValue: 'Train Details' })}
              </Typography>
              {trainError && (
                <Alert severity='error' sx={{ mb: 2, borderRadius: 2 }}>
                  {trainError}
                </Alert>
              )}
              {trainValidationError && !trainError && (
                <Alert severity='warning' sx={{ mb: 2, borderRadius: 2 }}>
                  {trainValidationError}
                </Alert>
              )}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label={t('trip.trainNumber', {
                      defaultValue: 'Train Number',
                    })}
                    name='trainNumber'
                    placeholder={t('form.trainNumberPlaceholder', {
                      defaultValue: 'e.g., 1902',
                    })}
                    value={formData.trainNumber ?? ''}
                    onChange={handleChange}
                    fullWidth
                    required
                    autoComplete='off'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <TrainIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <>
                          {trainLoading && (
                            <CircularProgress
                              color='inherit'
                              size={18}
                              sx={{ mr: 1 }}
                            />
                          )}
                        </>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label={t('trip.departureTime', {
                      defaultValue: 'Departure Time',
                    })}
                    name='departureTime'
                    type='time'
                    placeholder={t('form.departureTimePlaceholder', {
                      defaultValue: 'HH:MM',
                    })}
                    value={formData.departureTime ?? ''}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <AccessTimeIcon sx={{ color: 'text.secondary' }} />
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
                    inputProps={{ min: 50, step: 10 }}
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
                startIcon={
                  <FlightTakeoffIcon sx={{ transform: 'scaleY(2p1)' }} />
                }
                sx={{ px: 6, direction: 'row', gap: 0.5 }}
              >
                {loading ? `${t('common.loading')}...` : t('nav.postTrip')}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
