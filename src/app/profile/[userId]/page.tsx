'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  Grid,
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
import { NavBar } from '@/components/common/NavBar';
import { useAuth } from '@/contexts/AuthContext';
import { useRatings } from '@/hooks/useRatings';
import { useNotification } from '@/contexts/NotificationContext';
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

interface ProfilePageProps {
  params: { userId: string };
}

function ProfileContent({ userId }: { userId: string }) {
  const { user: currentUser } = useAuth();
  const { getUserRatings } = useRatings();
  const { createChat } = useChat();
  const router = useRouter();
  const theme = useTheme();
  const { showNotification } = useNotification();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [ratings, setRatings] = useState<RatingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactLoading, setContactLoading] = useState(false);

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const user = await getDocument<User>('users', userId);
        const userRatings = await getUserRatings(userId);
        setProfileUser(user);
        setRatings(userRatings);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId, getUserRatings]);

  const handleContact = async () => {
    if (!currentUser) return;

    try {
      setContactLoading(true);
      const chatId = await createChat(userId);
      showNotification('Chat created successfully!', 'success');
      setTimeout(() => router.push(`/chats/${chatId}`), 500);
    } catch (error) {
      console.error('Error creating chat:', error);
      showNotification('Failed to create chat. Please try again.', 'error');
    } finally {
      setContactLoading(false);
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
          User not found
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          This user profile does not exist.
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
        <Grid container spacing={3} alignItems='center'>
          <Grid item xs={12} sm='auto'>
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
          </Grid>
          <Grid item xs={12} sm>
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
            {!isOwnProfile && (
              <Button
                variant='gradient'
                startIcon={<ChatIcon />}
                onClick={handleContact}
                disabled={contactLoading}
                sx={{ borderRadius: '9999px' }}
              >
                {contactLoading ? 'Starting Chat...' : 'Send Message'}
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
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
              Total Reviews
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
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
              Average Rating
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
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
              Verification Status
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Reviews */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant='h5' fontWeight={700} sx={{ mb: 3 }}>
          Reviews ({ratings.length})
        </Typography>

        {ratings.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant='body2' color='text.secondary'>
              No reviews yet
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
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={rating.score} readOnly size='small' />
                      <Typography variant='body2' fontWeight={600}>
                        {rating.score.toFixed(1)}
                      </Typography>
                    </Box>
                    <Typography variant='caption' color='text.secondary'>
                      {format(rating.createdAt, 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                  {rating.comment && (
                    <Typography variant='body2' color='text.secondary'>
                      {rating.comment}
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
        <NavBar />
        <Container maxWidth='lg' sx={{ py: 4 }}>
          <ProfileContent userId={params.userId} />
        </Container>
      </Box>
    </AuthGuard>
  );
}
