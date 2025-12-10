'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Container,
} from '@mui/material';
import { CreateRequestInput } from '@/types/request';
import { useRequests } from '@/hooks/useRequests';
import { useNotification } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';

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

  const { createRequest } = useRequests();
  const router = useRouter();
  const { showNotification } = useNotification();
  const { t } = useLanguage();

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
    <Box component='form' onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Typography
        variant='h3'
        component='h1'
        gutterBottom
        fontWeight={900}
        sx={{
          mb: 4,
          fontSize: { xs: '2rem', md: '2.5rem' },
          textAlign: 'center',
        }}
      >
        {t('request.requestDelivery')}
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      <Alert severity='info' sx={{ mb: 3, borderRadius: 2 }}>
        {t('request.offerPrerequisite')}
      </Alert>

      <Paper
        elevation={11}
        sx={{
          p: { xs: 3, md: 6 },
          borderRadius: 4,
          border: 1,
          borderColor: 'divider',
        }}
      >
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
              label={t('request.fromCity')}
              name='fromCity'
              value={formData.fromCity}
              onChange={handleChange}
              fullWidth
              required
              size='small'
            />
          </Box>

          <Box
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' },
              minWidth: 0,
            }}
          >
            <TextField
              label={t('request.toCity')}
              name='toCity'
              value={formData.toCity}
              onChange={handleChange}
              fullWidth
              required
              size='small'
            />
          </Box>

          <Box
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' },
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
              size='small'
            />
          </Box>

          <Box
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' },
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
              size='small'
            />
          </Box>

          <Box sx={{ flex: '1 1 100%' }}>
            <TextField
              label={t('request.offerPrice')}
              name='offerPrice'
              type='number'
              value={formData.offerPrice}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 0, step: 0.01 }}
              size='small'
            />
          </Box>

          <Box sx={{ flex: '1 1 100%' }}>
            <TextField
              label={t('request.description')}
              name='description'
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              helperText={t('form.descriptionPlaceholder')}
              size='small'
            />
          </Box>

          <Box sx={{ flex: '1 1 100%' }}>
            <Button
              type='submit'
              variant='contained'
              fullWidth
              disabled={loading}
              size='large'
              sx={{ mt: 2 }}
            >
              {loading ? `${t('common.loading')}...` : t('common.submit')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
