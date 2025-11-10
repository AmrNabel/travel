'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  TextField,
  Box,
  Typography,
  Avatar,
  CircularProgress,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useRatings } from '@/hooks/useRatings';
import { useNotification } from '@/contexts/NotificationContext';

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  toUserId: string;
  toUserName: string;
  tripId?: string;
  requestId?: string;
  type: 'traveler' | 'sender';
}

export const RatingDialog: React.FC<RatingDialogProps> = ({
  open,
  onClose,
  toUserId,
  toUserName,
  tripId,
  requestId,
  type,
}) => {
  const [score, setScore] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { createRating } = useRatings();
  const { showNotification } = useNotification();

  const handleSubmit = async () => {
    if (score === 0) {
      showNotification('Please select a rating', 'warning');
      return;
    }

    setLoading(true);
    try {
      await createRating({
        toUserId,
        tripId,
        requestId,
        score,
        comment: comment.trim() || undefined,
      });

      showNotification('✅ Rating submitted! Thank you!', 'success');
      onClose();

      // Reset form
      setScore(5);
      setComment('');
    } catch (error: any) {
      console.error('Error submitting rating:', error);
      showNotification('Failed to submit rating: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 56, height: 56 }}>
            {toUserName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant='h6'>
              Rate {type === 'traveler' ? 'Traveler' : 'Sender'}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {toUserName}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant='body1' gutterBottom fontWeight={600}>
            How was your experience?
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              my: 3,
              justifyContent: 'center',
            }}
          >
            <Rating
              value={score}
              onChange={(_, newValue) => setScore(newValue || 0)}
              size='large'
              emptyIcon={
                <StarIcon style={{ opacity: 0.3 }} fontSize='inherit' />
              }
            />
            <Typography variant='h6' color='primary.main'>
              {score}/5
            </Typography>
          </Box>

          <TextField
            label='Share your experience (optional)'
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            placeholder={
              type === 'traveler'
                ? 'How was the delivery? Was the traveler reliable?'
                : 'How was the sender? Was the item as described?'
            }
            sx={{ mt: 2 }}
          />

          <Typography variant='caption' color='text.secondary' sx={{ mt: 1 }}>
            Your rating helps build trust in the community
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} disabled={loading}>
          Skip
        </Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          disabled={loading || score === 0}
          sx={{
            minWidth: 120,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          {loading ? (
            <CircularProgress size={16} color='inherit' />
          ) : (
            <StarIcon fontSize='small' />
          )}
          {loading ? 'Submitting...' : 'Submit Rating'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
