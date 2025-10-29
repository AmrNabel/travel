'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  alpha,
  useTheme,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useOffers } from '@/hooks/useOffers';
import { useDelivery } from '@/hooks/useDelivery';
import { useTrip } from '@/hooks/useTrip';
import { useRequests } from '@/hooks/useRequests';
import { useTrips } from '@/hooks/useTrips';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { NavBar } from '@/components/common/NavBar';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RatingDialog } from '@/components/ratings/RatingDialog';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FlightIcon from '@mui/icons-material/Flight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatIcon from '@mui/icons-material/Chat';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FlagIcon from '@mui/icons-material/Flag';
import StarIcon from '@mui/icons-material/Star';
import { formatDistanceToNow } from 'date-fns';
import { Offer } from '@/types/offer';

function OffersPageContent() {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: 'accept' | 'decline' | null;
    offerId: string | null;
  }>({ open: false, action: null, offerId: null });
  const [loading, setLoading] = useState(false);
  const [ratingDialog, setRatingDialog] = useState<{
    open: boolean;
    toUserId: string;
    tripId?: string;
    requestId?: string;
    type: 'traveler' | 'sender';
  } | null>(null);

  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const theme = useTheme();
  const { showNotification } = useNotification();
  const { markAsDelivered } = useDelivery();
  const { markTripAsComplete } = useTrip();

  // Get offers sent by this user
  const {
    offers: sentOffers,
    loading: sentLoading,
    acceptOffer,
    declineOffer,
  } = useOffers({ senderId: user?.id });

  // Get offers received by this user
  const { offers: receivedOffers, loading: receivedLoading } = useOffers({
    receiverId: user?.id,
  });

  // Get ALL requests to show delivery status for both sent and received offers
  const { requests } = useRequests();

  // Get trips to show completion button
  const { trips } = useTrips({ userId: user?.id });

  const handleAcceptOffer = async (offerId: string) => {
    setLoading(true);
    try {
      await acceptOffer(offerId);
      showNotification(t('offer.acceptSuccess'), 'success');
      setConfirmDialog({ open: false, action: null, offerId: null });
    } catch (error: any) {
      console.error('Error accepting offer:', error);
      showNotification(t('error.acceptingOffer'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineOffer = async (offerId: string) => {
    setLoading(true);
    try {
      await declineOffer(offerId);
      showNotification(t('offer.declineSuccess'), 'info');
      setConfirmDialog({ open: false, action: null, offerId: null });
    } catch (error: any) {
      console.error('Error declining offer:', error);
      showNotification(t('error.decliningOffer'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDelivered = async (requestId: string, senderId: string) => {
    setLoading(true);
    try {
      await markAsDelivered(requestId);
      showNotification(t('delivery.deliveryCompleted'), 'success');

      // Prompt traveler to rate sender
      setRatingDialog({
        open: true,
        toUserId: senderId,
        requestId,
        type: 'sender',
      });
    } catch (error: any) {
      console.error('Error marking as delivered:', error);
      showNotification(t('delivery.deliveryFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTripAndRate = async (
    tripId: string,
    senderId: string,
    requestId: string
  ) => {
    setLoading(true);
    try {
      await markTripAsComplete(tripId);
      showNotification(t('delivery.tripCompleted'), 'success');

      // Prompt traveler to rate sender
      setRatingDialog({
        open: true,
        toUserId: senderId,
        tripId,
        requestId,
        type: 'sender',
      });
    } catch (error: any) {
      console.error('Error completing trip:', error);
      showNotification(t('delivery.tripCompletionFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'declined':
      case 'expired':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleIcon />;
      case 'declined':
      case 'expired':
        return <CancelIcon />;
      case 'pending':
        return <AccessTimeIcon />;
      default:
        return null;
    }
  };

  const OfferCard = ({ offer }: { offer: Offer }) => {
    const isReceived = activeTab === 'received';
    const isPending = offer.status === 'pending';

    return (
      <Card elevation={2} sx={{ borderRadius: 2, overflow: 'visible' }}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalOfferIcon color='primary' />
              <Typography variant='h6' fontWeight={700}>
                ${offer.offeredPrice}
              </Typography>
            </Box>
            <Chip
              icon={getStatusIcon(offer.status) || undefined}
              label={
                offer.status.charAt(0).toUpperCase() + offer.status.slice(1)
              }
              color={getStatusColor(offer.status) as any}
              size='small'
            />
          </Box>

          {/* Trip Details */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'background.default',
              borderRadius: 2,
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <FlightIcon fontSize='small' color='action' />
              <Typography variant='body2' fontWeight={600}>
                {t('trip.tripDetails')}
              </Typography>
            </Box>
            {/* Note: In a real app, you'd fetch and display trip details */}
            <Typography variant='caption' color='text.secondary'>
              Trip ID: {offer.tripId}
            </Typography>
          </Box>

          {/* Message */}
          {offer.message && (
            <Box sx={{ mb: 2 }}>
              <Typography variant='body2' color='text.secondary'>
                &quot;{offer.message}&quot;
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Timestamps */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Typography variant='caption' color='text.disabled'>
              {formatDistanceToNow(offer.createdAt, { addSuffix: true })}
            </Typography>
            {offer.respondedAt && (
              <Typography variant='caption' color='text.disabled'>
                • Responded{' '}
                {formatDistanceToNow(offer.respondedAt, { addSuffix: true })}
              </Typography>
            )}
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isReceived && isPending && (
              <>
                <Button
                  variant='contained'
                  color='success'
                  size='small'
                  fullWidth
                  onClick={() =>
                    setConfirmDialog({
                      open: true,
                      action: 'accept',
                      offerId: offer.id,
                    })
                  }
                  startIcon={<CheckCircleIcon />}
                >
                  {t('offer.accept')}
                </Button>
                <Button
                  variant='outlined'
                  color='error'
                  size='small'
                  fullWidth
                  onClick={() =>
                    setConfirmDialog({
                      open: true,
                      action: 'decline',
                      offerId: offer.id,
                    })
                  }
                  startIcon={<CancelIcon />}
                >
                  {t('offer.decline')}
                </Button>
              </>
            )}

            {offer.status === 'accepted' && (
              <>
                {/* Get request to check delivery status */}
                {(() => {
                  const request = requests.find(
                    (r) => r.id === offer.requestId
                  );
                  const isDelivered = request?.status === 'delivered';
                  const isInTransit = request?.status === 'in_transit';

                  return (
                    <>
                      {/* Delivery Status Chip */}
                      {request && (
                        <Box sx={{ width: '100%', mb: 1 }}>
                          <Chip
                            icon={<LocalShippingIcon />}
                            label={
                              isDelivered
                                ? '✅ Delivered'
                                : isInTransit
                                  ? '🚚 In Transit'
                                  : '📦 Matched'
                            }
                            color={
                              isDelivered
                                ? 'success'
                                : isInTransit
                                  ? 'warning'
                                  : 'info'
                            }
                            sx={{ width: '100%' }}
                          />
                        </Box>
                      )}

                      {/* Complete Trip & Deliver Button (for traveler/receiver) */}
                      {isReceived && request && !isDelivered && (
                        <>
                          <Button
                            variant='contained'
                            color='success'
                            size='small'
                            fullWidth
                            startIcon={<FlagIcon />}
                            onClick={() =>
                              handleCompleteTripAndRate(
                                offer.tripId,
                                offer.senderId,
                                offer.requestId
                              )
                            }
                            disabled={loading}
                          >
                            {t('delivery.completeTripAndDeliver')}
                          </Button>
                          <Button
                            variant='outlined'
                            color='success'
                            size='small'
                            fullWidth
                            startIcon={<CheckCircleIcon />}
                            onClick={() =>
                              handleMarkAsDelivered(
                                offer.requestId,
                                offer.senderId
                              )
                            }
                            disabled={loading}
                          >
                            {t('delivery.markThisItemOnly')}
                          </Button>
                        </>
                      )}

                      {/* Rate Traveler Button (for sender when delivered) */}
                      {!isReceived && isDelivered && (
                        <Button
                          variant='contained'
                          color='primary'
                          size='small'
                          fullWidth
                          startIcon={<StarIcon />}
                          onClick={() =>
                            setRatingDialog({
                              open: true,
                              toUserId: offer.receiverId,
                              tripId: offer.tripId,
                              requestId: offer.requestId,
                              type: 'traveler',
                            })
                          }
                        >
                          {t('rating.rateTraveler')}
                        </Button>
                      )}

                      {/* Go to Chat Button */}
                      <Button
                        variant='contained'
                        size='small'
                        fullWidth
                        startIcon={<ChatIcon />}
                        onClick={() => {
                          router.push('/chats');
                        }}
                      >
                        {t('chat.goToChat')}
                      </Button>
                    </>
                  );
                })()}
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const currentOffers = activeTab === 'received' ? receivedOffers : sentOffers;
  const currentLoading =
    activeTab === 'received' ? receivedLoading : sentLoading;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavBar />

      <Container maxWidth='lg' sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h4' fontWeight={700} gutterBottom>
            {t('offer.myOffers')}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Manage offers you've sent and received
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{t('offer.received')}</span>
                  {receivedOffers.filter((o) => o.status === 'pending').length >
                    0 && (
                    <Chip
                      label={
                        receivedOffers.filter((o) => o.status === 'pending')
                          .length
                      }
                      size='small'
                      color='primary'
                    />
                  )}
                </Box>
              }
              value='received'
            />
            <Tab label={t('offer.sent')} value='sent' />
          </Tabs>
        </Paper>

        {/* Offers List */}
        {currentLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : currentOffers.length === 0 ? (
          <Paper
            elevation={2}
            sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}
          >
            <LocalOfferIcon
              sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
            />
            <Typography variant='h6' color='text.secondary' gutterBottom>
              {activeTab === 'received' ? t('offer.noReceivedOffers') : t('offer.noSentOffers')}
            </Typography>
            <Typography variant='body2' color='text.disabled' sx={{ mb: 3 }}>
              {activeTab === 'received'
                ? 'Offers from senders will appear here'
                : t('offer.noSentOffersDesc')}
            </Typography>
            {activeTab === 'sent' && (
              <Button
                variant='contained'
                onClick={() => router.push('/search')}
              >
                {t('search.browseTrips')}
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {currentOffers.map((offer) => (
              <Grid item xs={12} md={6} key={offer.id}>
                <OfferCard offer={offer} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({ open: false, action: null, offerId: null })
        }
      >
        <DialogTitle>
          {confirmDialog.action === 'accept'
            ? 'Accept Offer?'
            : 'Decline Offer?'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialog.action === 'accept'
              ? 'This will create a chat between you and the sender, and decline all other offers for this request.'
              : 'Are you sure you want to decline this offer? This action cannot be undone.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmDialog({ open: false, action: null, offerId: null })
            }
            disabled={loading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={() => {
              if (confirmDialog.offerId) {
                if (confirmDialog.action === 'accept') {
                  handleAcceptOffer(confirmDialog.offerId);
                } else {
                  handleDeclineOffer(confirmDialog.offerId);
                }
              }
            }}
            variant='contained'
            color={confirmDialog.action === 'accept' ? 'success' : 'error'}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : undefined}
          >
            {loading
              ? t('admin.processing')
              : confirmDialog.action === 'accept'
                ? t('offer.accept')
                : t('offer.decline')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rating Dialog */}
      {ratingDialog && (
        <RatingDialog
          open={ratingDialog.open}
          onClose={() => setRatingDialog(null)}
          toUserId={ratingDialog.toUserId}
          toUserName={
            // Fetch user name
            ratingDialog.type === 'traveler' ? 'Traveler' : 'Sender'
          }
          tripId={ratingDialog.tripId}
          requestId={ratingDialog.requestId}
          type={ratingDialog.type}
        />
      )}
    </Box>
  );
}

export default function OffersPage() {
  return (
    <AuthGuard>
      <OffersPageContent />
    </AuthGuard>
  );
}
