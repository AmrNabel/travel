'use client';

import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
  alpha,
  useTheme,
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import NatureIcon from '@mui/icons-material/Nature';

export default function HomePage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const theme = useTheme();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        }}
      >
        {/* Hero Section */}
        <Container maxWidth='lg' sx={{ flexGrow: 1, py: { xs: 6, md: 12 } }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 4, md: 8 },
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                flex: { xs: '1 1 100%', md: '1 1 calc(50% - 32px)' },
                minWidth: 0,
              }}
            >
              <Box>
                <Typography
                  variant='h1'
                  component='h1'
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                    fontWeight: 900,
                    mb: 2,
                    background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {t('home.hero.title')}
                </Typography>
                <Typography
                  variant='h5'
                  color='text.secondary'
                  paragraph
                  sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, mb: 4 }}
                >
                  {t('home.hero.subtitle')}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    width: '100%',
                  }}
                >
                  <Link href='/signup' passHref legacyBehavior>
                    <Button
                      variant='gradient'
                      size='large'
                      sx={{ flex: { xs: 1, sm: 1 } }}
                    >
                      {t('home.hero.travelerButton')}
                    </Button>
                  </Link>
                  <Link href='/signup' passHref legacyBehavior>
                    <Button
                      variant='orange'
                      size='large'
                      sx={{ flex: { xs: 1, sm: 1 } }}
                    >
                      {t('home.hero.senderButton')}
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                flex: { xs: '1 1 100%', md: '1 1 calc(50% - 32px)' },
                minWidth: 0,
              }}
            >
              <Box
                component='img'
                src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'
                alt='Travel delivery illustration'
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: theme.shadows[11],
                }}
              />
            </Box>
          </Box>

          {/* Features Section */}
          <Box
            sx={{
              mt: { xs: 8, md: 12 },
              p: { xs: 4, md: 6 },
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography
              variant='h2'
              align='center'
              sx={{ mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}
            >
              {t('home.features.title')}
            </Typography>
            <Typography
              variant='body1'
              align='center'
              color='text.secondary'
              sx={{ mb: 6, maxWidth: 720, mx: 'auto' }}
            >
              {t('home.features.subtitle')}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
              }}
            >
              <Box
                sx={{
                  flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' },
                  minWidth: 0,
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    height: '100%',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[12],
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.secondary.main, 0.15),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <AccountBalanceWalletIcon
                      sx={{ fontSize: 28, color: 'secondary.main' }}
                    />
                  </Box>
                  <Typography variant='h6' gutterBottom fontWeight={700}>
                    {t('home.features.earnOnTravel.title')}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {t('home.features.earnOnTravel.description')}
                  </Typography>
                </Paper>
              </Box>

              <Box
                sx={{
                  flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' },
                  minWidth: 0,
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    height: '100%',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[12],
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <VerifiedUserIcon
                      sx={{ fontSize: 28, color: 'primary.main' }}
                    />
                  </Box>
                  <Typography variant='h6' gutterBottom fontWeight={700}>
                    {t('home.features.sendWithTrust.title')}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {t('home.features.sendWithTrust.description')}
                  </Typography>
                </Paper>
              </Box>

              <Box
                sx={{
                  flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' },
                  minWidth: 0,
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    height: '100%',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[12],
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      bgcolor: alpha('#10B981', 0.15),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <NatureIcon sx={{ fontSize: 28, color: '#10B981' }} />
                  </Box>
                  <Typography variant='h6' gutterBottom fontWeight={700}>
                    {t('home.features.ecoFriendly.title')}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {t('home.features.ecoFriendly.description')}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth='lg' sx={{ flexGrow: 1, py: 8 }}>
        <Typography
          variant='h2'
          component='h1'
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 800,
            mb: 4,
          }}
        >
          {t('home.loggedIn.welcome', { name: user.name })}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
          }}
        >
          <Box
            sx={{
              flex: {
                xs: '1 1 100%',
                sm: '1 1 calc(50% - 12px)',
                md: '1 1 calc(33.333% - 16px)',
              },
              minWidth: 0,
            }}
          >
            <Link href='/add-trip' passHref legacyBehavior>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[12],
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <FlightTakeoffIcon
                    sx={{ fontSize: 32, color: 'primary.main' }}
                  />
                </Box>
                <Typography variant='h6' gutterBottom fontWeight={700}>
                  {t('home.loggedIn.postTripTitle')}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {t('home.loggedIn.postTripDesc')}
                </Typography>
              </Paper>
            </Link>
          </Box>

          <Box
            sx={{
              flex: {
                xs: '1 1 100%',
                sm: '1 1 calc(50% - 12px)',
                md: '1 1 calc(33.333% - 16px)',
              },
              minWidth: 0,
            }}
          >
            <Link href='/send-item' passHref legacyBehavior>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[12],
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.secondary.main, 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <AccountBalanceWalletIcon
                    sx={{ fontSize: 32, color: 'secondary.main' }}
                  />
                </Box>
                <Typography variant='h6' gutterBottom fontWeight={700}>
                  {t('home.loggedIn.requestDeliveryTitle')}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {t('home.loggedIn.requestDeliveryDesc')}
                </Typography>
              </Paper>
            </Link>
          </Box>

          <Box
            sx={{
              flex: {
                xs: '1 1 100%',
                sm: '1 1 calc(50% - 12px)',
                md: '1 1 calc(33.333% - 16px)',
              },
              minWidth: 0,
            }}
          >
            <Link href='/search' passHref legacyBehavior>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[12],
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: alpha('#10B981', 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <VerifiedUserIcon sx={{ fontSize: 32, color: '#10B981' }} />
                </Box>
                <Typography variant='h6' gutterBottom fontWeight={700}>
                  {t('home.loggedIn.browseTitle')}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {t('home.loggedIn.browseDesc')}
                </Typography>
              </Paper>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
