'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Drawer,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  CircularProgress,
  Alert,
  AlertTitle,
  alpha,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { useTrips } from '@/hooks/useTrips';
import { useRequests } from '@/hooks/useRequests';
import { useChat } from '@/hooks/useChat';
import { useOffers } from '@/hooks/useOffers';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { RequestCard } from '@/components/requests/RequestCard';
import { OfferModal } from '@/components/offers/OfferModal';
import { Trip } from '@/types/trip';
import { DeliveryRequest } from '@/types/request';
import { TripCardWithUser } from '@/components/search/TripCardWithUser';
import { RequestCardSkeleton } from '@/components/common/LoadingSkeleton';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightIcon from '@mui/icons-material/Flight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LuggageIcon from '@mui/icons-material/Luggage';
import TrainIcon from '@mui/icons-material/Train';

// Capacity mapping for size range filtering
const CAPACITY_MAP: Record<string, number> = {
  Small: 1,
  Medium: 3,
  Large: 5,
};

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

  // Filter state
  const [filters, setFilters] = useState({
    trainNumber: '',
    dateStart: '',
    dateEnd: '',
    sizeRange: [0, 5] as [number, number],
  });

  // Applied filters (used for actual filtering)
  const [appliedFilters, setAppliedFilters] = useState({
    trainNumber: '',
    dateStart: '',
    dateEnd: '',
    sizeRange: [0, 5] as [number, number],
  });

  // Train data for showing departure time
  const [trainData, setTrainData] = useState<any>(null);
  const [trainLoading, setTrainLoading] = useState(false);
  const [trainDepartureTime, setTrainDepartureTime] = useState<string>('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { showNotification } = useNotification();

  // Fetch train data when train number is entered
  useEffect(() => {
    if (!filters.trainNumber?.trim()) {
      setTrainData(null);
      setTrainDepartureTime('');
      return;
    }

    let isActive = true;
    const controller = new AbortController();

    const loadTrain = async () => {
      setTrainLoading(true);
      setTrainData(null);
      setTrainDepartureTime('');

      try {
        const trainNum = filters.trainNumber.trim();
        const response = await fetch(`/trains/train-${trainNum}.json`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Train not found');
        }

        const data = await response.json();
        if (isActive) {
          setTrainData(data);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError' && isActive) {
          console.error('Error loading train data:', error);
          setTrainData(null);
          setTrainDepartureTime('');
        }
      } finally {
        if (isActive) {
          setTrainLoading(false);
        }
      }
    };

    loadTrain();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [filters.trainNumber]);

  // Find departure time based on selected station
  useEffect(() => {
    if (!trainData || !searchParams.fromCity?.trim()) {
      setTrainDepartureTime('');
      return;
    }

    const stations = trainData?.schedule?.stations ?? [];
    if (stations.length === 0) {
      setTrainDepartureTime('');
      return;
    }

    const langKey = language === 'ar-EG' ? 'ar' : 'en';
    const normalize = (value?: string | null) =>
      (value ?? '').trim().toLowerCase();

    const fromCity = normalize(searchParams.fromCity);
    const station = stations.find((s: any) => {
      const stationName =
        s.stationName?.[langKey] ??
        s.stationName?.en ??
        s.stationName?.ar ??
        '';
      return normalize(stationName) === fromCity;
    });

    if (station) {
      const departureTime = station.departureTime ?? station.arrivalTime ?? '';
      setTrainDepartureTime(departureTime);
    } else {
      setTrainDepartureTime('');
    }
  }, [trainData, searchParams.fromCity, language]);

  const { trips: allTrips, loading: tripsLoading } = useTrips(searchParams);
  const { requests, loading: requestsLoading } = useRequests(searchParams);

  // Filter trips based on applied filters
  const trips = allTrips.filter((trip) => {
    // Train number filter
    if (
      appliedFilters.trainNumber &&
      trip.trainNumber?.toLowerCase() !==
        appliedFilters.trainNumber.toLowerCase()
    ) {
      return false;
    }

    // Date range filter
    if (appliedFilters.dateStart || appliedFilters.dateEnd) {
      const tripDate = new Date(trip.date);
      tripDate.setHours(0, 0, 0, 0);

      if (appliedFilters.dateStart) {
        const startDate = new Date(appliedFilters.dateStart);
        startDate.setHours(0, 0, 0, 0);
        if (tripDate < startDate) return false;
      }

      if (appliedFilters.dateEnd) {
        const endDate = new Date(appliedFilters.dateEnd);
        endDate.setHours(23, 59, 59, 999);
        if (tripDate > endDate) return false;
      }
    }

    // Size range filter
    const tripCapacity = CAPACITY_MAP[trip.capacity] ?? 0;
    if (
      tripCapacity < appliedFilters.sizeRange[0] ||
      tripCapacity > appliedFilters.sizeRange[1]
    ) {
      return false;
    }

    return true;
  });
  // Get user's own requests for sending offers
  const { requests: myRequests } = useRequests(
    user ? { userId: user.id } : undefined
  );
  const hasActiveRequests = user
    ? myRequests.some((r) => r.status === 'pending')
    : false;
  const { createChat } = useChat();
  const { createOffer } = useOffers();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleContactTrip = async (tripId: string, userId: string) => {
    if (!user) {
      showNotification(t('auth.loginToAccess'), 'warning');
      router.push('/login');
      return;
    }

    if (user.id === userId) {
      showNotification(t('card.yourTrip'), 'info');
      return;
    }

    try {
      setContactLoading(tripId);
      const chatId = await createChat(userId, tripId);
      showNotification(t('chat.chatCreated'), 'success');
      setTimeout(() => router.push(`/chats/${chatId}`), 500);
    } catch (error) {
      console.error('Error creating chat:', error);
      showNotification(t('chat.chatError'), 'error');
    } finally {
      setContactLoading(null);
    }
  };

  const handleContactRequest = async (requestId: string, userId: string) => {
    if (!user) {
      showNotification(t('auth.loginToAccess'), 'warning');
      router.push('/login');
      return;
    }

    if (user.id === userId) {
      showNotification(t('card.yourRequest'), 'info');
      return;
    }

    try {
      setContactLoading(requestId);
      const chatId = await createChat(userId, undefined, requestId);
      showNotification(t('chat.chatCreated'), 'success');
      setTimeout(() => router.push(`/chats/${chatId}`), 500);
    } catch (error) {
      console.error('Error creating chat:', error);
      showNotification(t('chat.chatError'), 'error');
    } finally {
      setContactLoading(null);
    }
  };

  const handleSendOffer = (trip: Trip) => {
    if (!user) {
      showNotification(t('auth.loginToAccess'), 'warning');
      router.push('/login');
      return;
    }

    if (user.id === trip.userId) {
      showNotification(t('card.yourTrip'), 'info');
      return;
    }

    // Check if user has any active requests
    const activeRequests = myRequests.filter((r) => r.status === 'pending');

    if (activeRequests.length === 0) {
      showNotification(t('offer.createRequestFirst'), 'warning');
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
      showNotification(t('offer.sendSuccess'), 'success');
      setOfferModalOpen(false);
    } catch (error: any) {
      console.error('Error sending offer:', error);
      throw error; // Re-throw to let OfferModal handle it
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    if (isMobile) {
      setMobileFilterOpen(false);
    }
  };

  const handleResetFilters = () => {
    const resetFilters = {
      trainNumber: '',
      dateStart: '',
      dateEnd: '',
      sizeRange: [0, 5] as [number, number],
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
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
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
      }}
    >
      <Typography variant='h6' gutterBottom fontWeight={700} sx={{ mb: 3 }}>
        {t('search.filters')}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label={t('search.from')}
          placeholder={t('form.fromCityPlaceholder')}
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
          label={t('search.to')}
          placeholder={t('form.toCityPlaceholder')}
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

        <Box>
          <TextField
            label={t('trip.trainNumber', { defaultValue: 'Train Number' })}
            placeholder={t('form.trainNumberPlaceholder', {
              defaultValue: 'e.g., 1902',
            })}
            value={filters.trainNumber}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, trainNumber: e.target.value }))
            }
            fullWidth
            size='small'
            helperText={
              trainLoading
                ? t('common.loading', { defaultValue: 'Loading...' })
                : trainDepartureTime
                  ? `${t('trip.departureTime', {
                      defaultValue: 'Departure Time',
                    })}: ${trainDepartureTime}`
                  : filters.trainNumber && searchParams.fromCity
                    ? t('search.trainStationNotFound', {
                        defaultValue: 'Train does not stop at this station',
                      })
                    : filters.trainNumber && !searchParams.fromCity
                      ? t('search.selectStationFirst', {
                          defaultValue:
                            'Select a departure station to see time',
                        })
                      : ''
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <TrainIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: trainLoading ? (
                <InputAdornment position='end'>
                  <CircularProgress size={16} />
                </InputAdornment>
              ) : undefined,
            }}
          />
        </Box>

        <Box>
          <Typography variant='body2' fontWeight={600} sx={{ mb: 1 }}>
            {t('form.dateLabel')}
          </Typography>
          <TextField
            label={t('search.dateStart', { defaultValue: 'Start Date' })}
            type='date'
            value={filters.dateStart}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, dateStart: e.target.value }))
            }
            fullWidth
            size='small'
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 1 }}
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
          <TextField
            label={t('search.dateEnd', { defaultValue: 'End Date' })}
            type='date'
            value={filters.dateEnd}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, dateEnd: e.target.value }))
            }
            fullWidth
            size='small'
            InputLabelProps={{ shrink: true }}
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
        </Box>

        <Box>
          <Typography variant='body2' fontWeight={600} sx={{ mb: 2 }}>
            {t('search.itemSize')} (
            {t('search.sizeRange', {
              defaultValue: 'Range',
            })}
            )
          </Typography>
          <Slider
            value={filters.sizeRange}
            onChange={(_, newValue) =>
              setFilters((prev) => ({
                ...prev,
                sizeRange: newValue as [number, number],
              }))
            }
            valueLabelDisplay='auto'
            min={0}
            max={5}
            step={1}
            marks={[
              { value: 0, label: '0kg' },
              { value: 1, label: t('search.small').split('(')[0].trim() },
              { value: 3, label: t('search.medium').split('(')[0].trim() },
              { value: 5, label: t('search.large').split('(')[0].trim() },
            ]}
            sx={{ mb: 1 }}
          />
          <Typography variant='caption' color='text.secondary'>
            {filters.sizeRange[0]}kg - {filters.sizeRange[1]}kg
          </Typography>
        </Box>

        <Button
          variant='gradient'
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleApplyFilters}
        >
          {t('search.applyFilters')}
        </Button>
        <Button variant='outlined' fullWidth onClick={handleResetFilters}>
          {t('search.reset')}
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
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
      }}
    >
      {/* Header */}

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor='right'
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      >
        <Box sx={{ width: 300, p: 3 }}>{FilterSidebar}</Box>
      </Drawer>

      {/* Main Content */}
      <Container
        maxWidth='xl'
        sx={{
          flexGrow: 1,
          py: 4,
          px: { xs: 2, sm: 3 },
          width: '100%',
          maxWidth: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            width: '100%',
            maxWidth: '100%',
            margin: 0,
          }}
        >
          {/* Filters Sidebar - Desktop */}
          {!isMobile && (
            <Box sx={{ flex: '0 0 25%', maxWidth: '25%' }}>{FilterSidebar}</Box>
          )}

          {/* Results */}
          <Box
            sx={{
              flex: { xs: '1 1 100%', md: isMobile ? '1 1 100%' : '1 1 75%' },
              width: '100%',
              maxWidth: '100%',
            }}
          >
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
                  {t('search.title')}
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  {t('search.found', {
                    count:
                      activeTab === 'trips' ? trips.length : requests.length,
                    type:
                      activeTab === 'trips'
                        ? t('myActivity.myTrips').toLowerCase()
                        : t('myActivity.myRequests').toLowerCase(),
                  })}
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
                <ToggleButton value='trips'>
                  {t('search.browseTrips')}
                </ToggleButton>
                <ToggleButton value='requests'>
                  {t('search.browseRequests')}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {activeTab === 'trips' && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  width: '100%',
                  maxWidth: '100%',
                }}
              >
                {activeTab === 'trips' && user && !hasActiveRequests && (
                  <Alert
                    severity='info'
                    variant='outlined'
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: { xs: 2, sm: 1 },
                      p: { xs: 2, sm: 3 },
                      width: '100%',
                      maxWidth: '100%',
                      overflowX: 'hidden',
                    }}
                    action={
                      <Button
                        component={NextLink}
                        href='/send-item'
                        size={isMobile ? 'medium' : 'small'}
                        variant='contained'
                        fullWidth={isMobile}
                        sx={{
                          minWidth: { xs: '100%', sm: 'auto' },
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t('offer.createRequestCTA')}
                      </Button>
                    }
                  >
                    <Box sx={{ flex: 1, width: { xs: '100%', sm: 'auto' } }}>
                      <AlertTitle
                        sx={{
                          mb: { xs: 1, sm: 0.5 },
                          fontSize: { xs: '0.95rem', sm: '1rem' },
                        }}
                      >
                        {t('offer.createRequestBannerTitle')}
                      </AlertTitle>
                      <Typography
                        variant='body2'
                        sx={{
                          fontSize: { xs: '0.875rem', sm: '0.875rem' },
                          lineHeight: { xs: 1.5, sm: 1.43 },
                        }}
                      >
                        {t('offer.createRequestBannerBody')}
                      </Typography>
                    </Box>
                  </Alert>
                )}
                {tripsLoading ? (
                  <Typography>{t('common.loading')}...</Typography>
                ) : trips.length === 0 ? (
                  <Paper
                    elevation={2}
                    sx={{
                      p: 6,
                      textAlign: 'center',
                      borderRadius: 3,
                      width: '100%',
                      maxWidth: '100%',
                    }}
                  >
                    <FlightIcon
                      sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                    />
                    <Typography variant='h6' color='text.secondary'>
                      {t('trip.noTrips')}
                    </Typography>
                    <Typography variant='body2' color='text.disabled'>
                      {t('search.tryAdjusting')}
                    </Typography>
                  </Paper>
                ) : (
                  trips.map((trip, index) => (
                    <TripCardWithUser
                      key={trip.id}
                      trip={trip}
                      index={index}
                      isMatch={index === 0}
                      showSendOffer={hasActiveRequests}
                      showSendOfferHint={!!user && !hasActiveRequests}
                      onSendOffer={() => handleSendOffer(trip)}
                      onMessage={() => handleContactTrip(trip.id, trip.userId)}
                      isOwnTrip={trip.userId === user?.id}
                      contactLoading={contactLoading === trip.id}
                    />
                  ))
                )}
              </Box>
            )}

            {activeTab === 'requests' && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  width: '100%',
                  maxWidth: '100%',
                }}
              >
                {requestsLoading ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                      width: '100%',
                      maxWidth: '100%',
                    }}
                  >
                    {[1, 2, 3].map((i) => (
                      <RequestCardSkeleton key={i} />
                    ))}
                  </Box>
                ) : requests.length === 0 ? (
                  <Paper
                    elevation={2}
                    sx={{
                      p: { xs: 4, sm: 6 },
                      textAlign: 'center',
                      borderRadius: 3,
                      width: '100%',
                      maxWidth: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      <LuggageIcon
                        sx={{ fontSize: 60, color: 'secondary.main' }}
                      />
                    </Box>
                    <Typography variant='h5' gutterBottom fontWeight={700}>
                      {t('request.noRequests')}
                    </Typography>
                    <Typography
                      variant='body1'
                      color='text.secondary'
                      sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}
                    >
                      {t('search.tryAdjusting')}
                    </Typography>
                    <Button
                      variant='outlined'
                      onClick={handleResetFilters}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mx: 'auto',
                      }}
                    >
                      {t('search.reset')}
                    </Button>
                  </Paper>
                ) : (
                  requests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onContact={() =>
                        handleContactRequest(request.id, request.userId)
                      }
                      isOwnRequest={request.userId === user?.id}
                      contactLoading={contactLoading === request.id}
                    />
                  ))
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Container>

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
