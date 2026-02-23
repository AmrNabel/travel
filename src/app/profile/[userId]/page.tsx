'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  Rating,
  CircularProgress,
  Button,
  Divider,
  Card,
  CardContent,
  alpha,
  useTheme,
} from '@mui/material';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import { useRatings } from '@/hooks/useRatings';
import { useNotification } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDocument } from '@/lib/firebase/firestore';
import { User } from '@/types/user';
import { Rating as RatingType } from '@/types/rating';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChatIcon from '@mui/icons-material/Chat';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useChat } from '@/hooks/useChat';
import { recalculateUserRatings } from '@/utils/recalculateRatings';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ProfilePageProps {
  params: { userId: string };
}

function ProfileContent({ userId }: { userId: string }) {
  const { user: currentUser } = useAuth();
  const { t } = useLanguage();
  const { getUserRatingsWithDetails } = useRatings();
  const { createChat } = useChat();
  const router = useRouter();
  const theme = useTheme();
  const { showNotification } = useNotification();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [ratings, setRatings] = useState<
    (RatingType & { fromUserName?: string })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [contactLoading, setContactLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const user = await getDocument<User>('users', userId);
        const userRatings = await getUserRatingsWithDetails(userId);
        setProfileUser(user);
        setRatings(userRatings);
      } catch (error) {
        console.error('Error loading profile:', error);
        showNotification(t('error.loadingProfile'), 'error');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleContact = async () => {
    if (!currentUser) {
      showNotification(t('auth.signInToContinue'), 'info');
      router.push('/login');
      return;
    }

    try {
      setContactLoading(true);
      const chatId = await createChat(userId);
      showNotification(t('chat.chatCreated'), 'success');
      setTimeout(() => router.push(`/chats/${chatId}`), 500);
    } catch (error) {
      console.error('Error creating chat:', error);
      showNotification(t('chat.chatError'), 'error');
    } finally {
      setContactLoading(false);
    }
  };

  const handleRefreshStats = async () => {
    setRefreshing(true);
    try {
      const stats = await recalculateUserRatings(userId);
      showNotification(
        t('profile.statsUpdated', {
          rating: stats.rating.toFixed(1),
          count: stats.totalRatings,
        }),
        'success',
      );
      // Reload the profile to show updated stats
      const user = await getDocument<User>('users', userId);
      setProfileUser(user);
    } catch (error) {
      console.error('Error refreshing stats:', error);
      showNotification(t('profile.statsUpdateFailed'), 'error');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!profileUser) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography variant='h5' gutterBottom>
          {t('profile.userNotFound')}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {t('profile.userNotFoundDesc')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Profile Header */}
      <Paper
        elevation={2}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            alignItems: 'center',
          }}
        >
          <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
            <Avatar
              sx={{
                width: { xs: 100, sm: 120 },
                height: { xs: 100, sm: 120 },
                fontSize: '3rem',
                fontWeight: 700,
                border: 4,
                borderColor: 'primary.main',
                bgcolor: 'primary.main',
              }}
            >
              {profileUser.name.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 auto' }, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant='h4' fontWeight={800}>
                {profileUser.name}
              </Typography>
              {profileUser.verified && (
                <VerifiedIcon color='primary' sx={{ fontSize: 28 }} />
              )}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip
                label={profileUser.role}
                size='small'
                color='primary'
                variant='outlined'
              />
              <Chip
                icon={<StarIcon />}
                label={`${profileUser.rating.toFixed(1)} (${profileUser.totalRatings} reviews)`}
                size='small'
                sx={{
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  color: 'warning.dark',
                }}
              />
            </Box>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              {profileUser.email}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {!isOwnProfile && (
                <Button
                  variant='gradient'
                  onClick={handleContact}
                  disabled={contactLoading}
                  sx={{
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  {contactLoading ? (
                    <CircularProgress size={16} color='inherit' />
                  ) : (
                    <ChatIcon fontSize='small' />
                  )}
                  {contactLoading
                    ? t('profile.startingChat')
                    : t('profile.sendMessage')}
                </Button>
              )}
              <Button
                variant='outlined'
                onClick={handleRefreshStats}
                disabled={refreshing}
                sx={{
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                {refreshing ? (
                  <CircularProgress size={16} color='inherit' />
                ) : (
                  <RefreshIcon fontSize='small' />
                )}
                {refreshing ? t('profile.updating') : t('profile.refreshStats')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Stats */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          mb: 4,
        }}
      >
        <Box
          sx={{
            flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 16px)' },
            minWidth: 0,
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 3,
            }}
          >
            <Typography variant='h3' fontWeight={800} color='primary.main'>
              {profileUser.totalRatings}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {t('rating.totalReviews')}
            </Typography>
          </Paper>
        </Box>
        <Box
          sx={{
            flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 16px)' },
            minWidth: 0,
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 3,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <Rating
                value={profileUser.rating}
                readOnly
                precision={0.1}
                size='large'
              />
            </Box>
            <Typography variant='body2' color='text.secondary'>
              {t('rating.averageRating')}
            </Typography>
          </Paper>
        </Box>
        <Box
          sx={{
            flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 16px)' },
            minWidth: 0,
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 3,
            }}
          >
            <Typography variant='h3' fontWeight={800} color='success.main'>
              {profileUser.verified ? '✓' : '—'}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {t('profile.verificationStatus')}
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Reviews */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant='h5' fontWeight={700} sx={{ mb: 3 }}>
          {t('rating.reviews')} ({ratings.length})
        </Typography>

        {ratings.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant='body2' color='text.secondary'>
              {t('rating.noReviews')}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {ratings.map((rating) => (
              <Card
                key={rating.id}
                variant='outlined'
                sx={{
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.default, 0.5),
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: '0.875rem',
                            bgcolor: 'primary.main',
                          }}
                        >
                          {rating.fromUserName?.charAt(0).toUpperCase() || '?'}
                        </Avatar>
                        <Typography variant='body2' fontWeight={600}>
                          {rating.fromUserName || 'Anonymous'}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Rating value={rating.score} readOnly size='small' />
                        <Typography variant='body2' fontWeight={600}>
                          {rating.score.toFixed(1)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant='caption' color='text.secondary'>
                      {format(rating.createdAt, 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                  {rating.comment && (
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{
                        fontStyle: 'italic',
                        pl: 5,
                        borderLeft: 2,
                        borderColor: 'divider',
                      }}
                    >
                      &quot;{rating.comment}&quot;
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default function ProfilePage({ params }: ProfilePageProps) {
  return (
    <AuthGuard>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth='lg' sx={{ py: 4 }}>
          <ProfileContent userId={params.userId} />
        </Container>
      </Box>
    </AuthGuard>
  );
}
