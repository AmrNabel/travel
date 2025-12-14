'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Button,
  alpha,
  useTheme,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTrips } from '@/hooks/useTrips';
import { useRequests } from '@/hooks/useRequests';
import { translateStatus } from '@/utils/translateStatus';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LuggageIcon from '@mui/icons-material/Luggage';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FlightIcon from '@mui/icons-material/Flight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import ScaleIcon from '@mui/icons-material/Scale';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import Link from 'next/link';
import { Trip } from '@/types/trip';
import { DeliveryRequest } from '@/types/request';
import { formatLocalizedDate } from '@/utils/formatDate';

function MyTripsContent() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const [tripMenuAnchor, setTripMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [selectedTrip, setSelectedTrip] = useState<
    Trip | DeliveryRequest | null
  >(null);

  const theme = useTheme();

  const { trips, loading: tripsLoading } = useTrips({ userId: user?.id });

  const { requests, loading: requestsLoading } = useRequests({
    userId: user?.id,
  });

  const handleTripMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    item: Trip | DeliveryRequest
  ) => {
    setTripMenuAnchor(event.currentTarget);
    setSelectedTrip(item);
  };

  const handleTripMenuClose = () => {
    setTripMenuAnchor(null);
    setSelectedTrip(null);
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit:', selectedTrip);
    handleTripMenuClose();
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete:', selectedTrip);
    handleTripMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon />;
      case 'completed':
        return <CheckCircleIcon />;
      case 'cancelled':
        return <CancelIcon />;
      default:
        return <AccessTimeIcon />;
    }
  };

  const renderTripCard = (trip: Trip) => (
    <Card
      key={trip.id}
      elevation={2}
      sx={{
        position: 'relative',
        overflow: 'visible',
        borderRadius: 3,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: 1,
        borderColor: 'divider',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with Route and Actions */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            mb: 2,
          }}
        >
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
                  {trip.fromCity}
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
                  {trip.toCity}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Status and Menu */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              justifyContent: { xs: 'space-between', sm: 'flex-end' },
            }}
          >
            <Chip
              icon={getStatusIcon(trip.status)}
              label={translateStatus(trip.status, t)}
              color={getStatusColor(trip.status) as any}
              size='small'
              sx={{
                fontWeight: 600,
              }}
            />
            <IconButton
              size='small'
              onClick={(e) => handleTripMenuOpen(e, trip)}
              sx={{
                border: 1,
                borderColor: 'divider',
              }}
            >
              <MoreVertIcon fontSize='small' />
            </IconButton>
          </Box>
        </Box>

        {/* Details Section */}
        <Box
          sx={{
            p: 2,
            bgcolor: alpha(theme.palette.background.default, 0.5),
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
            }}
          >
            {/* Date */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flex: { xs: '1 1 100%', sm: '0 0 auto' },
              }}
            >
              <CalendarMonthIcon
                sx={{ fontSize: 18, color: 'text.secondary' }}
              />
              <Typography variant='body2' color='text.secondary'>
                {formatLocalizedDate(trip.date, 'MMM dd, yyyy', language)}
              </Typography>
            </Box>

            {/* Capacity */}
            <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
              <Chip
                icon={<LuggageIcon sx={{ fontSize: 18 }} />}
                label={trip.capacity}
                size='small'
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: 'primary.main',
                  fontWeight: 600,
                }}
              />
            </Box>

            {/* Price */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flex: { xs: '1 1 100%', sm: '0 0 auto' },
              }}
            >
              <AttachMoneyIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant='body2' fontWeight={600} color='text.primary'>
                ${trip.pricePerKg}
                <Typography
                  component='span'
                  variant='caption'
                  color='text.secondary'
                  sx={{ ml: 0.5 }}
                >
                  {t('card.perKg')}
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Description */}
        {trip.description && (
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
                {trip.description}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const getRequestStatusColor = (status: string) => {
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

  const getRequestStatusIcon = (status: string) => {
    switch (status) {
      case 'matched':
      case 'delivered':
        return <CheckCircleIcon />;
      case 'in_transit':
        return <AccessTimeIcon />;
      case 'cancelled':
        return <CancelIcon />;
      case 'pending':
        return <AccessTimeIcon />;
      default:
        return null;
    }
  };

  const renderRequestCard = (request: DeliveryRequest) => (
    <Card
      key={request.id}
      elevation={2}
      sx={{
        position: 'relative',
        overflow: 'visible',
        borderRadius: 3,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: 1,
        borderColor: 'divider',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with Route and Actions */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            mb: 2,
          }}
        >
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

          {/* Status and Menu */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              justifyContent: { xs: 'space-between', sm: 'flex-end' },
            }}
          >
            <Chip
              icon={getRequestStatusIcon(request.status) || undefined}
              label={translateStatus(request.status, t)}
              color={getRequestStatusColor(request.status) as any}
              size='small'
              sx={{
                fontWeight: 600,
              }}
            />
            <IconButton
              size='small'
              onClick={(e) => handleTripMenuOpen(e, request)}
              sx={{
                border: 1,
                borderColor: 'divider',
              }}
            >
              <MoreVertIcon fontSize='small' />
            </IconButton>
          </Box>
        </Box>

        {/* Details Section */}
        <Box
          sx={{
            p: 2,
            bgcolor: alpha(theme.palette.background.default, 0.5),
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
            }}
          >
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flex: { xs: '1 1 100%', sm: '0 0 auto' },
              }}
            >
              <ScaleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant='body2' color='text.secondary'>
                {request.weight}
              </Typography>
            </Box>

            {/* Offer Price */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flex: { xs: '1 1 100%', sm: '0 0 auto' },
              }}
            >
              <AttachMoneyIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant='body2' fontWeight={600} color='text.primary'>
                ${request.offerPrice}
              </Typography>
            </Box>
          </Box>
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

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 4,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <Typography
          variant='h3'
          fontWeight={800}
          sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}
        >
          {t('myActivity.title')}
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            px: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              minHeight: 64,
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FlightTakeoffIcon />
                <span>{t('myActivity.myTrips')}</span>
                {trips.length > 0 && (
                  <Chip
                    label={trips.length}
                    size='small'
                    color='primary'
                    sx={{ height: 20, minWidth: 20 }}
                  />
                )}
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LuggageIcon />
                <span>{t('myActivity.myRequests')}</span>
                {requests.length > 0 && (
                  <Chip
                    label={requests.length}
                    size='small'
                    color='primary'
                    sx={{ height: 20, minWidth: 20 }}
                  />
                )}
              </Box>
            }
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box>
              {tripsLoading ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    py: 8,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : trips.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    px: 3,
                    bgcolor: alpha(theme.palette.background.default, 0.5),
                    borderRadius: 3,
                  }}
                >
                  <FlightTakeoffIcon
                    sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                  />
                  <Typography variant='h6' gutterBottom fontWeight={600}>
                    {t('trip.noTrips')}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}
                  >
                    {t('trip.noTripsDesc')}
                  </Typography>
                  <Link href='/add-trip' passHref legacyBehavior>
                    <Button
                      variant='gradient'
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mx: 'auto',
                      }}
                    >
                      <AddIcon fontSize='small' />
                      {t('trip.postTrip')}
                    </Button>
                  </Link>
                </Paper>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                  }}
                >
                  {trips.map((trip) => (
                    <Box
                      key={trip.id}
                      sx={{
                        flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
                        minWidth: 0,
                      }}
                    >
                      {renderTripCard(trip)}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              {requestsLoading ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    py: 8,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : requests.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    px: 3,
                    bgcolor: alpha(theme.palette.background.default, 0.5),
                    borderRadius: 3,
                  }}
                >
                  <LuggageIcon
                    sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                  />
                  <Typography variant='h6' gutterBottom fontWeight={600}>
                    {t('request.noRequests')}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}
                  >
                    {t('request.noRequestsDesc')}
                  </Typography>
                  <Link href='/send-item' passHref legacyBehavior>
                    <Button
                      variant='orange'
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mx: 'auto',
                      }}
                    >
                      <AddIcon fontSize='small' />
                      {t('request.sendItem')}
                    </Button>
                  </Link>
                </Paper>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                  }}
                >
                  {requests.map((request) => (
                    <Box
                      key={request.id}
                      sx={{
                        flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
                        minWidth: 0,
                      }}
                    >
                      {renderRequestCard(request)}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>

      <Menu
        anchorEl={tripMenuAnchor}
        open={Boolean(tripMenuAnchor)}
        onClose={handleTripMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize='small' sx={{ mr: 1 }} />
          {t('common.edit')}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize='small' sx={{ mr: 1 }} />
          {t('common.delete')}
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default function MyTripsPage() {
  return (
    <AuthGuard>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth='lg' sx={{ py: 4 }}>
          <MyTripsContent />
        </Container>
      </Box>
    </AuthGuard>
  );
}
