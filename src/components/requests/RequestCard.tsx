'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from '@mui/material';
import { DeliveryRequest } from '@/types/request';
import { useLanguage } from '@/contexts/LanguageContext';

interface RequestCardProps {
  request: DeliveryRequest;
  onContact?: () => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onContact,
}) => {
  const { t } = useLanguage();
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display='flex' justifyContent='space-between' alignItems='start'>
          <Box>
            <Typography variant='h6' component='div'>
              {request.fromCity} → {request.toCity}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {request.itemType}
            </Typography>
          </Box>
          <Chip
            label={request.status}
            color={request.status === 'pending' ? 'warning' : 'default'}
            size='small'
          />
        </Box>

        <Box mt={2}>
          <Typography variant='body2'>
            <strong>{t('request.weight')}:</strong> {request.weight}
          </Typography>
          <Typography variant='body2'>
            <strong>{t('request.offerPrice')}:</strong> ${request.offerPrice}
          </Typography>
          {request.description && (
            <Typography variant='body2' mt={1}>
              {request.description}
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
            {t('card.contactSender')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
