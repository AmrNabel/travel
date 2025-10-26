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
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { TripCard } from '@/components/trips/TripCard';
import { RequestCard } from '@/components/requests/RequestCard';
import { NavBar } from '@/components/common/NavBar';
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const { trips, loading: tripsLoading } = useTrips(searchParams);
  const { requests, loading: requestsLoading } = useRequests(searchParams);
  const { createChat } = useChat();
  const { user } = useAuth();
  const { showNotification } = useNotification();

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
                      <Card
                        key={trip.id}
                        elevation={2}
                        sx={{
                          position: 'relative',
                          overflow: 'visible',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: index === 0 ? 2 : 1,
                          borderColor:
                            index === 0 ? 'secondary.main' : 'divider',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[8],
                          },
                        }}
                      >
                        {index === 0 && (
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
                                  src={`https://i.pravatar.cc/150?img=${index + 2}`}
                                />
                                <Box>
                                  <Typography
                                    variant='subtitle1'
                                    fontWeight={700}
                                  >
                                    Traveler
                                  </Typography>
                                  <Typography
                                    variant='caption'
                                    color='text.secondary'
                                  >
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
                                  <Typography
                                    variant='caption'
                                    color='text.secondary'
                                  >
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
                                  <FlightIcon
                                    sx={{ mx: 1, color: 'primary.main' }}
                                  />
                                  <Divider sx={{ flex: 1 }} />
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant='body1' fontWeight={700}>
                                    {trip.toCity || 'LON'}
                                  </Typography>
                                  <Typography
                                    variant='caption'
                                    color='text.secondary'
                                  >
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
                                <Typography
                                  variant='body2'
                                  color='text.secondary'
                                >
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
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.15
                                  ),
                                  color: 'primary.main',
                                  fontWeight: 600,
                                }}
                              />
                            </Grid>

                            <Grid item xs={12} sm='auto'>
                              <Button
                                variant='contained'
                                size='small'
                                fullWidth
                                onClick={() =>
                                  handleContactTrip(trip.id, trip.userId)
                                }
                                disabled={
                                  contactLoading === trip.id ||
                                  trip.userId === user?.id
                                }
                                startIcon={
                                  contactLoading === trip.id && (
                                    <CircularProgress
                                      size={16}
                                      color='inherit'
                                    />
                                  )
                                }
                              >
                                {contactLoading === trip.id
                                  ? 'Connecting...'
                                  : trip.userId === user?.id
                                    ? 'Your Trip'
                                    : 'Contact'}
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
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
    </Box>
  );
}
