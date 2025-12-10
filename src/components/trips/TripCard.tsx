'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from '@mui/material';
import { Trip } from '@/types/trip';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatLocalizedDate } from '@/utils/formatDate';
import { translateStatus } from '@/utils/translateStatus';

interface TripCardProps {
  trip: Trip;
  onContact?: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onContact }) => {
  const { t, language } = useLanguage();
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display='flex' justifyContent='space-between' alignItems='start'>
          <Box>
            <Typography variant='h6' component='div'>
              {trip.fromCity} → {trip.toCity}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {formatLocalizedDate(trip.date, 'MMM dd, yyyy', language)}
            </Typography>
          </Box>
          <Chip
            label={translateStatus(trip.status, t)}
            color={trip.status === 'active' ? 'success' : 'default'}
            size='small'
          />
        </Box>

        <Box mt={2}>
          <Typography variant='body2'>
            <strong>{t('card.capacity')}:</strong> {trip.capacity}
          </Typography>
          <Typography variant='body2'>
            <strong>{t('card.price')}:</strong> ${trip.pricePerKg}
            {t('card.perKg')}
          </Typography>
          {trip.description && (
            <Typography variant='body2' mt={1}>
              {trip.description}
            </Typography>
          )}
        </Box>

        {onContact && (
          <Button
            variant='contained'
            size='small'
            onClick={onContact}
            sx={{ mt: 2 }}
          >
            {t('card.contactTraveler')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
