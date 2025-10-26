'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Rating as MuiRating,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { useRatings } from '@/hooks/useRatings';

interface RatingFormProps {
  toUserId: string;
  tripId?: string;
  requestId?: string;
  onSuccess?: () => void;
}

export const RatingForm: React.FC<RatingFormProps> = ({
  toUserId,
  tripId,
  requestId,
  onSuccess,
}) => {
  const [score, setScore] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const { submitRating, loading } = useRatings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await submitRating({
        toUserId,
        tripId,
        requestId,
        score,
        comment: comment || undefined,
      });

      onSuccess?.();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to submit rating');
    }
  };

  return (
    <Box component='form' onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
      <Typography variant='h6' gutterBottom>
        Rate Your Experience
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography component='legend'>Rating</Typography>
        <MuiRating
          value={score}
          onChange={(_, value) => setScore(value || 5)}
          size='large'
        />
      </Box>

      <TextField
        label='Comment (Optional)'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />

      <Button type='submit' variant='contained' fullWidth disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Rating'}
      </Button>
    </Box>
  );
};
