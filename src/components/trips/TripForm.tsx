'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, TextField, Button, Typography, Alert, Grid } from '@mui/material';
import { CreateTripInput } from '@/types/trip';
import { useTrips } from '@/hooks/useTrips';

export const TripForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateTripInput>({
    fromCity: '',
    toCity: '',
    date: new Date(),
    capacity: '',
    pricePerKg: 0,
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { createTrip } = useTrips();
  const router = useRouter();

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
      await createTrip(formData);
      router.push(`/search`);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to create trip');
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
        Post a Trip
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
            label='Travel Date'
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
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label='Capacity (e.g., 10kg)'
            name='capacity'
            value={formData.capacity}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label='Price per Kg'
            name='pricePerKg'
            type='number'
            value={formData.pricePerKg}
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
        {loading ? 'Creating Trip...' : 'Post Trip'}
      </Button>
    </Box>
  );
};
