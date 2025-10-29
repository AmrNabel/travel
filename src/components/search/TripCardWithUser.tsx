'use client';

import {
  Card,
  CardContent,
  Grid,
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
import FlightIcon from '@mui/icons-material/Flight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LuggageIcon from '@mui/icons-material/Luggage';

interface TripCardWithUserProps {
  trip: Trip;
  index: number;
  isMatch: boolean;
  showSendOffer: boolean;
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
  onSendOffer,
  onMessage,
  isOwnTrip,
  contactLoading,
}) => {
  const theme = useTheme();
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
          Match
        </Box>
      )}
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} sm='auto'>
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
                    traveler?.name || 'Traveler'
                  )}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  Verified Traveler
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm>
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
                <Typography variant='caption' color='text.secondary'>
                  New York
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
                <Typography variant='caption' color='text.secondary'>
                  London
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm='auto'>
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
                  ? new Date(trip.date).toLocaleDateString()
                  : 'Oct 15 - Oct 22'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm='auto'>
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
          </Grid>

          <Grid item xs={12} sm='auto'>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              {/* Send Offer Button */}
              {showSendOffer && !isOwnTrip && (
                <Button variant='gradient' size='small' onClick={onSendOffer}>
                  Send Offer
                </Button>
              )}

              {/* Contact Button */}
              <Button
                variant='contained'
                size='small'
                fullWidth
                onClick={onMessage}
                disabled={contactLoading || isOwnTrip}
                startIcon={
                  contactLoading && (
                    <CircularProgress size={16} color='inherit' />
                  )
                }
              >
                {contactLoading
                  ? 'Connecting...'
                  : isOwnTrip
                    ? 'Your Trip'
                    : 'Message'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
