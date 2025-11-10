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
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { NavBar } from '@/components/common/NavBar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTrips } from '@/hooks/useTrips';
import { useRequests } from '@/hooks/useRequests';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LuggageIcon from '@mui/icons-material/Luggage';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import Link from 'next/link';
import { Trip } from '@/types/trip';
import { DeliveryRequest } from '@/types/request';

function MyTripsContent() {
  const { user } = useAuth();
  const { t } = useLanguage();
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

  const renderTripCard = (trip: Trip) => (
    <Card
      key={trip.id}
      elevation={2}
      sx={{
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant='h6' fontWeight={700}>
              {trip.fromCity} → {trip.toCity}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {format(trip.date, 'MMM dd, yyyy')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Chip
              label={trip.status}
              size='small'
              color={trip.status === 'active' ? 'success' : 'default'}
            />
            <IconButton
              size='small'
              onClick={(e) => handleTripMenuOpen(e, trip)}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant='body2'>
            <strong>{t('card.capacity')}:</strong> {trip.capacity}
          </Typography>
          <Typography variant='body2'>
            <strong>{t('card.price')}:</strong> ${trip.pricePerKg}{t('card.perKg')}
          </Typography>
          {trip.description && (
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              {trip.description}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const renderRequestCard = (request: DeliveryRequest) => (
    <Card
      key={request.id}
      elevation={2}
      sx={{
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant='h6' fontWeight={700}>
              {request.fromCity} → {request.toCity}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {request.itemType}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Chip
              label={request.status}
              size='small'
              color={request.status === 'pending' ? 'warning' : 'default'}
            />
            <IconButton
              size='small'
              onClick={(e) => handleTripMenuOpen(e, request)}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant='body2'>
            <strong>{t('request.weight')}:</strong> {request.weight}
          </Typography>
          <Typography variant='body2'>
            <strong>{t('request.offerPrice')}:</strong> ${request.offerPrice}
          </Typography>
          {request.description && (
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              {request.description}
            </Typography>
          )}
        </Box>
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
        elevation={0}
        sx={{
          bgcolor: alpha(theme.palette.background.paper, 0.6),
          borderRadius: 3,
          p: 3,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab
            label={`${t('myActivity.myTrips')} (${trips.length})`}
            icon={<FlightTakeoffIcon />}
            iconPosition='start'
          />
          <Tab
            label={`${t('myActivity.myRequests')} (${requests.length})`}
            icon={<LuggageIcon />}
            iconPosition='start'
          />
        </Tabs>

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
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                }}
              >
                <FlightTakeoffIcon
                  sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                />
                <Typography variant='h6' gutterBottom>
                  {t('trip.noTrips')}
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ mb: 3 }}
                >
                  {t('trip.noTripsDesc')}
                </Typography>
                <Link href='/add-trip' passHref legacyBehavior>
                  <Button variant='gradient' startIcon={<AddIcon />}>
                    {t('trip.postTrip')}
                  </Button>
                </Link>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {trips.map((trip) => (
                  <Grid item xs={12} md={6} key={trip.id}>
                    {renderTripCard(trip)}
                  </Grid>
                ))}
              </Grid>
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
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                }}
              >
                <LuggageIcon
                  sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                />
                <Typography variant='h6' gutterBottom>
                  {t('request.noRequests')}
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ mb: 3 }}
                >
                  {t('request.noRequestsDesc')}
                </Typography>
                <Link href='/send-item' passHref legacyBehavior>
                  <Button variant='orange' startIcon={<AddIcon />}>
                    {t('request.sendItem')}
                  </Button>
                </Link>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {requests.map((request) => (
                  <Grid item xs={12} md={6} key={request.id}>
                    {renderRequestCard(request)}
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
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
        <NavBar />
        <Container maxWidth='lg' sx={{ py: 4 }}>
          <MyTripsContent />
        </Container>
      </Box>
    </AuthGuard>
  );
}
