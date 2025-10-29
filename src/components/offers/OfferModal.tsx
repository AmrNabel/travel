'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  InputAdornment,
  Divider,
  Chip,
} from '@mui/material';
import { Trip } from '@/types/trip';
import { DeliveryRequest } from '@/types/request';
import { CreateOfferInput } from '@/types/offer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MessageIcon from '@mui/icons-material/Message';
import FlightIcon from '@mui/icons-material/Flight';

interface OfferModalProps {
  open: boolean;
  trip: Trip;
  request: DeliveryRequest;
  onClose: () => void;
  onSubmit: (offer: CreateOfferInput) => Promise<void>;
}

export const OfferModal: React.FC<OfferModalProps> = ({
  open,
  trip,
  request,
  onClose,
  onSubmit,
}) => {
  const [offeredPrice, setOfferedPrice] = useState(request.offerPrice);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit({
        tripId: trip.id,
        requestId: request.id,
        offeredPrice,
        message: message || undefined,
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        <Box>
          <Typography variant='h5' fontWeight={700}>
            Send Offer
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Make an offer to the traveler
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Trip Summary */}
        <Box
          sx={{
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <FlightIcon color='primary' />
            <Typography variant='h6' fontWeight={600}>
              {trip.fromCity} → {trip.toCity}
            </Typography>
          </Box>
          <Typography variant='body2' color='text.secondary'>
            {new Date(trip.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip label={`Capacity: ${trip.capacity}`} size='small' />
            <Chip label={`$${trip.pricePerKg}/kg`} size='small' />
          </Box>
        </Box>

        {/* Item Details */}
        <Box sx={{ mb: 3 }}>
          <Typography variant='subtitle2' fontWeight={600} gutterBottom>
            Your Item
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {request.itemType} • {request.weight}
          </Typography>
          {request.description && (
            <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
              {request.description}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Offer Form */}
        <Box component='form' onSubmit={handleSubmit}>
          <TextField
            label='Your Offer'
            type='number'
            value={offeredPrice}
            onChange={(e) => setOfferedPrice(Number(e.target.value))}
            fullWidth
            required
            margin='normal'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
            helperText={`Suggested: $${request.offerPrice}`}
          />

          <TextField
            label='Message to Traveler (Optional)'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
            rows={3}
            margin='normal'
            placeholder='Any special instructions or questions...'
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position='start'
                  sx={{ alignSelf: 'flex-start', mt: 2 }}
                >
                  <MessageIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Sending...' : 'Send Offer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
