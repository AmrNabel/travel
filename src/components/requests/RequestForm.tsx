'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, TextField, Button, Typography, Alert, Grid } from '@mui/material';
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
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}
    >
      <Typography variant='h4' component='h1' gutterBottom>
        {t('request.requestDelivery')}
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label={t('request.fromCity')}
            name='fromCity'
            value={formData.fromCity}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label={t('request.toCity')}
            name='toCity'
            value={formData.toCity}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label={t('request.itemType')}
            name='itemType'
            value={formData.itemType}
            onChange={handleChange}
            fullWidth
            required
            helperText={t('form.itemTypePlaceholder')}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label={t('request.weight')}
            name='weight'
            value={formData.weight}
            onChange={handleChange}
            fullWidth
            required
            helperText={t('form.weightPlaceholder')}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label={t('request.offerPrice')}
            name='offerPrice'
            type='number'
            value={formData.offerPrice}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label={t('request.description')}
            name='description'
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            helperText={t('form.descriptionPlaceholder')}
          />
        </Grid>
      </Grid>

      <Button
        type='submit'
        variant='contained'
        fullWidth
        disabled={loading}
        sx={{ mt: 3 }}
      >
        {loading ? `${t('common.loading')}...` : t('common.submit')}
      </Button>
    </Box>
  );
};
