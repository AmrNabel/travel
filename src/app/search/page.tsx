'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Tabs,
  Tab,
  Paper,
  AppBar,
  Toolbar,
  InputAdornment,
  Chip,
  Avatar,
  alpha,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTrips } from '@/hooks/useTrips';
import { useRequests } from '@/hooks/useRequests';
import { useChat } from '@/hooks/useChat';
import { useOffers } from '@/hooks/useOffers';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { TripCard } from '@/components/trips/TripCard';
import { RequestCard } from '@/components/requests/RequestCard';
import { NavBar } from '@/components/common/NavBar';
import { OfferModal } from '@/components/offers/OfferModal';
import { Trip } from '@/types/trip';
import { DeliveryRequest } from '@/types/request';
import { TripCardWithUser } from '@/components/search/TripCardWithUser';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import FlightIcon from '@mui/icons-material/Flight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LuggageIcon from '@mui/icons-material/Luggage';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useState({
    fromCity: '',
    toCity: '',
  });
  const [activeTab, setActiveTab] = useState<'trips' | 'requests'>('trips');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [contactLoading, setContactLoading] = useState<string | null>(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [selectedTripForOffer, setSelectedTripForOffer] = useState<Trip | null>(
    null
  );
  const [selectedRequestForOffer, setSelectedRequestForOffer] =
    useState<DeliveryRequest | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const { user } = useAuth();
  const { showNotification } = useNotification();

  const { trips, loading: tripsLoading } = useTrips(searchParams);
  const { requests, loading: requestsLoading } = useRequests(searchParams);
  // Get user's own requests for sending offers
  const { requests: myRequests } = useRequests(
    user ? { userId: user.id } : undefined
  );
  const { createChat } = useChat();
  const { createOffer } = useOffers();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleContactTrip = async (tripId: string, userId: string) => {
    if (!user) {
      showNotification('Please login to contact travelers', 'warning');
      router.push('/login');
      return;
    }

    if (user.id === userId) {
      showNotification('This is your own trip', 'info');
      return;
    }

    try {
      setContactLoading(tripId);
      const chatId = await createChat(userId, tripId);
      showNotification('Chat created successfully! Redirecting...', 'success');
      setTimeout(() => router.push(`/chats/${chatId}`), 500);
    } catch (error) {
      console.error('Error creating chat:', error);
      showNotification('Failed to create chat. Please try again.', 'error');
    } finally {
      setContactLoading(null);
    }
  };

  const handleContactRequest = async (requestId: string, userId: string) => {
    if (!user) {
      showNotification('Please login to contact senders', 'warning');
      router.push('/login');
      return;
    }

    if (user.id === userId) {
      showNotification('This is your own request', 'info');
      return;
    }

    try {
      setContactLoading(requestId);
      const chatId = await createChat(userId, undefined, requestId);
      showNotification('Chat created successfully! Redirecting...', 'success');
      setTimeout(() => router.push(`/chats/${chatId}`), 500);
    } catch (error) {
      console.error('Error creating chat:', error);
      showNotification('Failed to create chat. Please try again.', 'error');
    } finally {
      setContactLoading(null);
    }
  };

  const handleSendOffer = (trip: Trip) => {
    if (!user) {
      showNotification('Please login to send offers', 'warning');
      router.push('/login');
      return;
    }

    if (user.id === trip.userId) {
      showNotification('This is your own trip', 'info');
      return;
    }

    // Check if user has any active requests
    const activeRequests = myRequests.filter((r) => r.status === 'pending');

    if (activeRequests.length === 0) {
      showNotification(
        'Please create a delivery request first to send offers',
        'warning'
      );
      router.push('/send-item');
      return;
    }

    // For now, use the first active request (we can enhance this later with a selector)
    setSelectedTripForOffer(trip);
    setSelectedRequestForOffer(activeRequests[0]);
    setOfferModalOpen(true);
  };

  const handleOfferSubmit = async (offerInput: any) => {
    try {
      await createOffer(offerInput);
      showNotification('✅ Offer sent successfully!', 'success');
      setOfferModalOpen(false);
    } catch (error: any) {
      console.error('Error sending offer:', error);
      throw error; // Re-throw to let OfferModal handle it
    }
  };

  const FilterSidebar = (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        position: { md: 'sticky' },
        top: { md: 100 },
        height: 'fit-content',
      }}
    >
      <Typography variant='h6' gutterBottom fontWeight={700} sx={{ mb: 3 }}>
        Filters
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label='From'
          placeholder='New York, USA'
          value={searchParams.fromCity}
          onChange={(e) =>
            setSearchParams((prev) => ({ ...prev, fromCity: e.target.value }))
          }
          fullWidth
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <FlightTakeoffIcon
                  sx={{ color: 'text.secondary', fontSize: 20 }}
                />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label='To'
          placeholder='London, UK'
          value={searchParams.toCity}
          onChange={(e) =>
            setSearchParams((prev) => ({ ...prev, toCity: e.target.value }))
          }
          fullWidth
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <FlightLandIcon
                  sx={{ color: 'text.secondary', fontSize: 20 }}
                />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label='Date'
          placeholder='Select dates'
          fullWidth
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <CalendarMonthIcon
                  sx={{ color: 'text.secondary', fontSize: 20 }}
                />
              </InputAdornment>
            ),
          }}
        />

        <Box>
          <Typography variant='body2' fontWeight={600} sx={{ mb: 1 }}>
            Item Size
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {['Small (Up to 1kg)', 'Medium (1-5kg)', 'Large (5kg+)'].map(
              (size) => (
                <Box key={size} sx={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type='checkbox'
                    style={{ marginRight: 8 }}
                    defaultChecked={size === 'Small (Up to 1kg)'}
                  />
                  <Typography variant='body2'>{size}</Typography>
                </Box>
              )
            )}
          </Box>
        </Box>

        <Button variant='gradient' fullWidth sx={{ mt: 2 }}>
          Apply Filters
        </Button>
        <Button variant='outlined' fullWidth>
          Reset
        </Button>
      </Box>
    </Paper>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Header */}
      <NavBar />

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor='right'
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      >
        <Box sx={{ width: 300, p: 3 }}>{FilterSidebar}</Box>
      </Drawer>

      {/* Main Content */}
      <Container maxWidth='xl' sx={{ flexGrow: 1, py: 4 }}>
        <Grid container spacing={3}>
          {/* Filters Sidebar - Desktop */}
          {!isMobile && (
            <Grid item xs={12} md={3}>
              {FilterSidebar}
            </Grid>
          )}

          {/* Results */}
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', md: 'center' },
                  mb: 4,
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant='h3'
                    gutterBottom
                    fontWeight={800}
                    sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}
                  >
                    Search Results
                  </Typography>
                  <Typography variant='body1' color='text.secondary'>
                    Found{' '}
                    {activeTab === 'trips' ? trips.length : requests.length}{' '}
                    matching {activeTab} for you!
                  </Typography>
                </Box>

                <ToggleButtonGroup
                  value={activeTab}
                  exclusive
                  onChange={(_, value) => value && setActiveTab(value)}
                  sx={{
                    bgcolor: 'background.default',
                    p: 0.5,
                    borderRadius: 2,
                    '& .MuiToggleButton-root': {
                      border: 'none',
                      borderRadius: 1.5,
                      px: 3,
                      py: 1,
                      fontWeight: 600,
                      '&.Mui-selected': {
                        bgcolor: 'background.paper',
                        boxShadow: theme.shadows[2],
                        '&:hover': {
                          bgcolor: 'background.paper',
                        },
                      },
                    },
                  }}
                >
                  <ToggleButton value='trips'>Browse Trips</ToggleButton>
                  <ToggleButton value='requests'>Browse Requests</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {activeTab === 'trips' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {tripsLoading ? (
                    <Typography>Loading...</Typography>
                  ) : trips.length === 0 ? (
                    <Paper
                      elevation={2}
                      sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}
                    >
                      <FlightIcon
                        sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                      />
                      <Typography variant='h6' color='text.secondary'>
                        No trips found
                      </Typography>
                      <Typography variant='body2' color='text.disabled'>
                        Try adjusting your search filters
                      </Typography>
                    </Paper>
                  ) : (
                    trips.map((trip, index) => (
                      <TripCardWithUser
                        key={trip.id}
                        trip={trip}
                        index={index}
                        isMatch={index === 0}
                        showSendOffer={
                          myRequests.filter((r) => r.status === 'pending')
                            .length > 0
                        }
                        onSendOffer={() => handleSendOffer(trip)}
                        onMessage={() =>
                          handleContactTrip(trip.id, trip.userId)
                        }
                        isOwnTrip={trip.userId === user?.id}
                        contactLoading={contactLoading === trip.id}
                      />
                    ))
                  )}
                </Box>
              )}

              {activeTab === 'requests' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {requestsLoading ? (
                    <Typography>Loading...</Typography>
                  ) : requests.length === 0 ? (
                    <Paper
                      elevation={2}
                      sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}
                    >
                      <LuggageIcon
                        sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                      />
                      <Typography variant='h6' color='text.secondary'>
                        No requests found
                      </Typography>
                      <Typography variant='body2' color='text.disabled'>
                        Try adjusting your search filters
                      </Typography>
                    </Paper>
                  ) : (
                    requests.map((request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        onContact={() =>
                          handleContactRequest(request.id, request.userId)
                        }
                      />
                    ))
                  )}
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        component='footer'
        sx={{
          py: 4,
          textAlign: 'center',
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          mt: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            mb: 2,
          }}
        >
          <FlightTakeoffIcon sx={{ color: 'primary.main' }} />
          <Typography variant='body1' fontWeight={600}>
            CarryOn
          </Typography>
        </Box>
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ fontStyle: 'italic' }}
        >
          &quot;The world is a book and those who do not travel read only one
          page.&quot;
        </Typography>
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
            flexWrap: 'wrap',
          }}
        >
          <Button
            size='small'
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            About
          </Button>
          <Button
            size='small'
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            FAQ
          </Button>
          <Button
            size='small'
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            Contact
          </Button>
        </Box>
      </Box>

      {/* Offer Modal */}
      {selectedTripForOffer && selectedRequestForOffer && (
        <OfferModal
          open={offerModalOpen}
          trip={selectedTripForOffer}
          request={selectedRequestForOffer}
          onClose={() => setOfferModalOpen(false)}
          onSubmit={handleOfferSubmit}
        />
      )}
    </Box>
  );
}
