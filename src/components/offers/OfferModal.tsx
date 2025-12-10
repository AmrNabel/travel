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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Trip } from '@/types/trip';
import { DeliveryRequest } from '@/types/request';
import { CreateOfferInput } from '@/types/offer';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatLocaleDate } from '@/utils/formatDate';
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
  const { t, language } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      setError(err.message || t('error.sendingOfferFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box>
          <Typography
            variant='h5'
            fontWeight={700}
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
          >
            {t('offer.modal.title')}
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            {t('offer.modal.subtitle')}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Trip Summary */}
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            bgcolor: 'background.default',
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <FlightIcon color='primary' />
            <Typography
              variant='h6'
              fontWeight={600}
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              {trip.fromCity} → {trip.toCity}
            </Typography>
          </Box>
          <Typography variant='body2' color='text.secondary'>
            {formatLocaleDate(trip.date, language)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            <Chip
              label={t('offer.modal.capacity', { capacity: trip.capacity })}
              size='small'
            />
            <Chip
              label={t('offer.modal.pricePerKg', { price: trip.pricePerKg })}
              size='small'
            />
          </Box>
        </Box>

        {/* Item Details */}
        <Box sx={{ mb: 3 }}>
          <Typography variant='subtitle2' fontWeight={600} gutterBottom>
            {t('offer.modal.yourItem')}
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
            label={t('offer.modal.yourOffer')}
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
            helperText={t('offer.modal.suggested', {
              price: request.offerPrice,
            })}
          />

          <TextField
            label={t('offer.messageToTraveler')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
            rows={3}
            margin='normal'
            placeholder={t('offer.modal.messagePlaceholder')}
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

      <DialogActions
        sx={{
          p: { xs: 2, sm: 3 },
          pt: 0,
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          fullWidth={isMobile}
          sx={{ m: 0 }}
        >
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          disabled={loading}
          fullWidth={isMobile}
          sx={{ minWidth: { xs: '100%', sm: 120 }, m: 0 }}
        >
          {loading ? t('offer.modal.sending') : t('offer.modal.sendOffer')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
