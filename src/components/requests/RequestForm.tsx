'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, TextField, Button, Typography, Alert, Grid } from '@mui/material';
import { CreateRequestInput } from '@/types/request';
import { useRequests } from '@/hooks/useRequests';
import { useNotification } from '@/contexts/NotificationContext';

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
      showNotification('Request created successfully!', 'success');
      router.push('/my-trips');
    } catch (err: unknown) {
      const error = err as { message?: string };
      const errorMsg = error.message || 'Failed to create request';
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
        Request Item Delivery
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label='From City'
            name='fromCity'
            value={formData.fromCity}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label='To City'
            name='toCity'
            value={formData.toCity}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label='Item Type'
            name='itemType'
            value={formData.itemType}
            onChange={handleChange}
            fullWidth
            required
            helperText='e.g., Documents, Electronics'
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label='Weight (e.g., 2kg)'
            name='weight'
            value={formData.weight}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label='Offer Price'
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
            label='Description (Optional)'
            name='description'
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
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
        {loading ? 'Creating Request...' : 'Submit Request'}
      </Button>
    </Box>
  );
};
