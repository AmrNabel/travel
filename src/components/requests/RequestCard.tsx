'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  Divider,
  alpha,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { DeliveryRequest } from '@/types/request';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/hooks/useUser';
import { translateStatus } from '@/utils/translateStatus';
import FlightIcon from '@mui/icons-material/Flight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScaleIcon from '@mui/icons-material/Scale';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import DescriptionIcon from '@mui/icons-material/Description';
import ChatIcon from '@mui/icons-material/Chat';

interface RequestCardProps {
  request: DeliveryRequest;
  onContact?: () => void;
  isOwnRequest?: boolean;
  contactLoading?: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onContact,
  isOwnRequest = false,
  contactLoading = false,
}) => {
  const theme = useTheme();
  const { t } = useLanguage();
  const { user: sender, loading: userLoading } = useUser(request.userId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'matched':
        return 'success';
      case 'in_transit':
        return 'info';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card
      elevation={2}
      sx={{
        position: 'relative',
        overflow: 'visible',
        borderRadius: 3,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: 1,
        borderColor: 'divider',
        mb: 2,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
          }}
        >
          {/* User Avatar and Name */}
          <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Avatar
                sx={{ width: 48, height: 48 }}
                src={
                  sender?.photoURL ||
                  `https://i.pravatar.cc/150?img=${request.userId?.charCodeAt(0) || 1}`
                }
              >
                {!userLoading && sender?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant='subtitle1' fontWeight={700}>
                  {userLoading ? (
                    <CircularProgress size={16} />
                  ) : (
                    sender?.name || t('request.sender')
                  )}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {t('request.sender')}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Route Display */}
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 auto' }, minWidth: 0 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent: 'center',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant='body1' fontWeight={700}>
                  {request.fromCity}
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                }}
              >
                <Divider sx={{ flex: 1 }} />
                <FlightIcon sx={{ mx: 1, color: 'primary.main' }} />
                <Divider sx={{ flex: 1 }} />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant='body1' fontWeight={700}>
                  {request.toCity}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Status Chip */}
          <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
            <Chip
              label={translateStatus(request.status, t)}
              color={getStatusColor(request.status) as any}
              size='small'
              sx={{
                fontWeight: 600,
              }}
            />
          </Box>

          {/* Item Type */}
          <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
            <Chip
              icon={<InventoryIcon sx={{ fontSize: 18 }} />}
              label={request.itemType}
              size='small'
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                color: 'primary.main',
                fontWeight: 600,
              }}
            />
          </Box>

          {/* Weight */}
          <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent: {
                  xs: 'center',
                  sm: 'flex-start',
                },
              }}
            >
              <ScaleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant='body2' color='text.secondary'>
                {request.weight}
              </Typography>
            </Box>
          </Box>

          {/* Offer Price */}
          <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent: {
                  xs: 'center',
                  sm: 'flex-start',
                },
              }}
            >
              <AttachMoneyIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant='body2' fontWeight={600} color='text.primary'>
                {request.offerPrice}
              </Typography>
            </Box>
          </Box>

          {/* Contact Button */}
          {onContact && (
            <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' }, minWidth: 0 }}>
              <Button
                variant='contained'
                size='small'
                fullWidth
                onClick={onContact}
                disabled={contactLoading || isOwnRequest}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 0.5, sm: 1 },
                  justifyContent: 'center',
                  minWidth: { xs: 0, sm: 140 },
                  width: { xs: '100%', sm: 'auto' },
                  px: { xs: 1, sm: 2 },
                  whiteSpace: { xs: 'nowrap', sm: 'normal' },
                  overflow: 'hidden',
                }}
              >
                {contactLoading ? (
                  <CircularProgress size={16} color='inherit' />
                ) : (
                  <ChatIcon fontSize='small' sx={{ flexShrink: 0 }} />
                )}
                <Box
                  component='span'
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: { xs: 'none', sm: 'inline' },
                  }}
                >
                  {contactLoading
                    ? t('chat.connecting')
                    : isOwnRequest
                      ? t('card.yourRequest')
                      : t('card.contactSender')}
                </Box>
                <Box
                  component='span'
                  sx={{
                    display: { xs: 'inline', sm: 'none' },
                  }}
                >
                  {contactLoading ? '' : t('card.contactSender')}
                </Box>
              </Button>
            </Box>
          )}
        </Box>

        {/* Description */}
        {request.description && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
              }}
            >
              <DescriptionIcon
                sx={{ fontSize: 18, color: 'text.secondary', mt: 0.5 }}
              />
              <Typography variant='body2' color='text.secondary'>
                {request.description}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
