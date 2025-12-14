'use client';

import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Button,
  Chip,
  Divider,
  alpha,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { Trip } from '@/types/trip';
import { useUser } from '@/hooks/useUser';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatLocaleDate } from '@/utils/formatDate';
import FlightIcon from '@mui/icons-material/Flight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LuggageIcon from '@mui/icons-material/Luggage';
import TrainIcon from '@mui/icons-material/Train';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatIcon from '@mui/icons-material/Chat';

interface TripCardWithUserProps {
  trip: Trip;
  index: number;
  isMatch: boolean;
  showSendOffer: boolean;
  showSendOfferHint?: boolean;
  onSendOffer: () => void;
  onMessage: () => void;
  isOwnTrip: boolean;
  contactLoading: boolean;
}

export const TripCardWithUser: React.FC<TripCardWithUserProps> = ({
  trip,
  index,
  isMatch,
  showSendOffer,
  showSendOfferHint = false,
  onSendOffer,
  onMessage,
  isOwnTrip,
  contactLoading,
}) => {
  const theme = useTheme();
  const { t, language } = useLanguage();
  const { user: traveler, loading: userLoading } = useUser(trip.userId);

  return (
    <Card
      elevation={index === 0 ? 8 : 2}
      sx={{
        position: 'relative',
        overflow: 'visible',
        borderRadius: 3,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: index === 0 ? 2 : 1,
        borderColor: index === 0 ? 'secondary.main' : 'divider',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      {isMatch && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: -12,
            transform: 'rotate(45deg)',
            bgcolor: 'secondary.main',
            color: 'white',
            px: 4,
            py: 0.5,
            fontWeight: 700,
            fontSize: '0.875rem',
            boxShadow: theme.shadows[4],
          }}
        >
          {t('myActivity.matched')}
        </Box>
      )}
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
          }}
        >
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
                  traveler?.photoURL ||
                  `https://i.pravatar.cc/150?img=${index + 2}`
                }
              >
                {!userLoading && traveler?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant='subtitle1' fontWeight={700}>
                  {userLoading ? (
                    <CircularProgress size={16} />
                  ) : (
                    traveler?.name || t('trip.traveler')
                  )}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {t('profile.verified')} {t('trip.traveler')}
                </Typography>
              </Box>
            </Box>
          </Box>

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
                  {trip.fromCity || 'NYC'}
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
                  {trip.toCity || 'LON'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {(trip.trainNumber || trip.departureTime) && (
            <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                }}
              >
                {trip.trainNumber && (
                  <Chip
                    icon={<TrainIcon sx={{ fontSize: 18 }} />}
                    label={`${t('trip.trainNumber')}: ${trip.trainNumber}`}
                    size='small'
                    sx={{
                      bgcolor: alpha(theme.palette.secondary.main, 0.12),
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                    }}
                  />
                )}
                {trip.departureTime && (
                  <Chip
                    icon={<AccessTimeIcon sx={{ fontSize: 18 }} />}
                    label={`${t('trip.departureTime')}: ${trip.departureTime}`}
                    size='small'
                    sx={{
                      bgcolor: alpha(theme.palette.secondary.main, 0.08),
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
            </Box>
          )}

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
              <CalendarMonthIcon
                sx={{ fontSize: 18, color: 'text.secondary' }}
              />
              <Typography variant='body2' color='text.secondary'>
                {trip.date
                  ? formatLocaleDate(trip.date, language)
                  : 'Oct 15 - Oct 22'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
            <Chip
              icon={<LuggageIcon />}
              label={trip.capacity || 'Small'}
              size='small'
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                color: 'primary.main',
                fontWeight: 600,
              }}
            />
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' }, minWidth: 0 }}>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                width: '100%',
              }}
            >
              {/* Send Offer Button */}
              {!isOwnTrip && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    flex: { xs: '1 1 100%', sm: '0 0 auto' },
                    minWidth: { xs: '100%', sm: 140 },
                    maxWidth: { xs: '100%', sm: 'none' },
                  }}
                >
                  <Button
                    variant='gradient'
                    size='small'
                    onClick={onSendOffer}
                    disabled={!showSendOffer}
                    fullWidth={isOwnTrip ? false : undefined}
                    sx={{
                      whiteSpace: { xs: 'nowrap', sm: 'normal' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minWidth: { xs: 0, sm: 140 },
                    }}
                  >
                    {t('action.sendOffer')}
                  </Button>
                  {!showSendOffer && showSendOfferHint && (
                    <Typography
                      variant='caption'
                      color='text.secondary'
                      sx={{ mt: 0.5, textAlign: 'center' }}
                    >
                      {t('offer.needRequestHint')}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Contact Button */}
              <Button
                variant='contained'
                size='small'
                fullWidth={!isOwnTrip && !showSendOffer}
                onClick={onMessage}
                disabled={contactLoading || isOwnTrip}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 0.5, sm: 1 },
                  justifyContent: 'center',
                  minWidth: { xs: 0, sm: 120 },
                  width: {
                    xs: '100%',
                    sm: isOwnTrip || showSendOffer ? 'auto' : '100%',
                  },
                  flex: { xs: '1 1 100%', sm: '0 0 auto' },
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
                    : isOwnTrip
                      ? t('card.yourTrip')
                      : t('card.message')}
                </Box>
                <Box
                  component='span'
                  sx={{
                    display: { xs: 'inline', sm: 'none' },
                  }}
                >
                  {contactLoading ? '' : t('card.message')}
                </Box>
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
