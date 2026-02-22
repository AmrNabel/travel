'use client';

import { useState, useEffect, useMemo } from 'react';
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
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { CreateRequestInput } from '@/types/request';
import { useRequests } from '@/hooks/useRequests';
import { useNotification } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  getCityOptions,
  filterCityOption,
  type CityOptionFull,
} from '@/lib/cities';
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
    offerPrice: 50,
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cityOptions, setCityOptions] = useState<CityOptionFull[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citiesError, setCitiesError] = useState('');

  const PRICE_STEP = 10;
  const PRICE_MIN = 50;
  const PRICE_MAX = 500;
  const priceOptions = useMemo(
    () =>
      Array.from(
        { length: (PRICE_MAX - PRICE_MIN) / PRICE_STEP + 1 },
        (_, i) => PRICE_MIN + i * PRICE_STEP
      ),
    []
  );

  const { createRequest } = useRequests();
  const router = useRouter();
  const { showNotification } = useNotification();
  const { t, language } = useLanguage();
  const theme = useTheme();

  useEffect(() => {
    let isActive = true;
    setCitiesLoading(true);
    setCitiesError('');
    getCityOptions(language === 'ar-EG' ? 'ar-EG' : 'en')
      .then((options) => {
        if (isActive) setCityOptions(options);
      })
      .catch((err) => {
        if (!isActive) return;
        console.error(err);
        setCitiesError(
          t('error.loadingStations', { defaultValue: 'Unable to load station list.' })
        );
        setCityOptions([]);
      })
      .finally(() => {
        if (isActive) setCitiesLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [language, t]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fromCity: '',
      toCity: '',
    }));
  }, [language]);

  // Normalize offerPrice to a valid step (50, 60, …) when not in options (e.g. stale state)
  useEffect(() => {
    if (
      typeof formData.offerPrice === 'number' &&
      !priceOptions.includes(formData.offerPrice)
    ) {
      setFormData((prev) => ({
        ...prev,
        offerPrice: PRICE_MIN,
      }));
    }
  }, [formData.offerPrice, priceOptions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'weight') {
      const digits = value.replace(/\D/g, '');
      const withoutLeadingZeros = digits.replace(/^0+/, '') || '';
      const num =
        withoutLeadingZeros === ''
          ? 0
          : Math.min(50, Math.max(0, parseInt(withoutLeadingZeros, 10) || 0));
      const weightStr =
        digits === '' ? '' : num === 0 ? '' : String(num);
      setFormData((prev) => ({
        ...prev,
        weight: weightStr,
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'offerPrice' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const weightNum = formData.weight ? parseInt(formData.weight, 10) : NaN;
    if (!formData.weight || weightNum < 1 || weightNum > 50 || !Number.isInteger(weightNum)) {
      setError(t('form.weightInvalid', { defaultValue: 'Weight must be an integer between 1 and 50 kg.' }));
      return;
    }
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
              {citiesError && (
                <Alert severity='error' sx={{ mb: 2, borderRadius: 2 }}>
                  {citiesError}
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
                  <Autocomplete<CityOptionFull>
                    options={cityOptions}
                    value={
                      cityOptions.find((o) => o.value === formData.fromCity) ??
                      null
                    }
                    getOptionLabel={(opt) => opt.label}
                    onChange={(_, value) =>
                      setFormData((prev) => ({
                        ...prev,
                        fromCity: value?.value ?? '',
                      }))
                    }
                    filterOptions={(options, { inputValue }) =>
                      options.filter((opt) =>
                        filterCityOption(inputValue, opt)
                      )
                    }
                    loading={citiesLoading}
                    autoHighlight
                    disablePortal
                    loadingText={t('common.loading', {
                      defaultValue: 'Loading...',
                    })}
                    noOptionsText={
                      citiesLoading
                        ? t('common.loading', { defaultValue: 'Loading...' })
                        : t('form.noStations', {
                            defaultValue: 'No stations found',
                          })
                    }
                    disabled={citiesLoading}
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
                              {citiesLoading && (
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
                  <Autocomplete<CityOptionFull>
                    options={cityOptions}
                    value={
                      cityOptions.find((o) => o.value === formData.toCity) ??
                      null
                    }
                    getOptionLabel={(opt) => opt.label}
                    onChange={(_, value) =>
                      setFormData((prev) => ({
                        ...prev,
                        toCity: value?.value ?? '',
                      }))
                    }
                    filterOptions={(options, { inputValue }) =>
                      options.filter((opt) =>
                        filterCityOption(inputValue, opt)
                      )
                    }
                    loading={citiesLoading}
                    autoHighlight
                    disablePortal
                    loadingText={t('common.loading', {
                      defaultValue: 'Loading...',
                    })}
                    noOptionsText={
                      citiesLoading
                        ? t('common.loading', { defaultValue: 'Loading...' })
                        : t('form.noStations', {
                            defaultValue: 'No stations found',
                          })
                    }
                    disabled={citiesLoading}
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
                              {citiesLoading && (
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
                    inputMode='numeric'
                    inputProps={{ min: 0, max: 50, step: 1 }}
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
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
                    minWidth: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <IconButton
                    size='small'
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        offerPrice: Math.max(
                          PRICE_MIN,
                          (prev.offerPrice || PRICE_MIN) - PRICE_STEP
                        ),
                      }))
                    }
                    disabled={formData.offerPrice <= PRICE_MIN}
                    aria-label={t('common.decrease', { defaultValue: 'Decrease' })}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AttachMoneyIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Select
                      value={priceOptions.includes(formData.offerPrice) ? formData.offerPrice : PRICE_MIN}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          offerPrice: Number(e.target.value),
                        }))
                      }
                      size='small'
                      sx={{ minWidth: 100 }}
                    >
                      {priceOptions.map((p) => (
                        <MenuItem key={p} value={p}>
                          {p} EGP
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <IconButton
                    size='small'
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        offerPrice: Math.min(
                          PRICE_MAX,
                          (prev.offerPrice || PRICE_MIN) + PRICE_STEP
                        ),
                      }))
                    }
                    disabled={formData.offerPrice >= PRICE_MAX}
                    aria-label={t('common.increase', { defaultValue: 'Increase' })}
                  >
                    <AddIcon />
                  </IconButton>
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
