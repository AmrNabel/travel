'use client';

import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  CircularProgress,
  alpha,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { NavBar } from '@/components/common/NavBar';
import Link from 'next/link';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import NatureIcon from '@mui/icons-material/Nature';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <AppBar position='static' elevation={0}>
          <Toolbar sx={{ py: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                flexGrow: 1,
              }}
            >
              <FlightTakeoffIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography
                variant='h6'
                component='div'
                sx={{ fontWeight: 700, color: 'text.primary' }}
              >
                {t('common.appName')}
              </Typography>
            </Box>
            {isMobile ? (
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{ color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Button
                  color='inherit'
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {t('nav.howItWorks')}
                </Button>
                <Button
                  color='inherit'
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {t('nav.aboutUs')}
                </Button>
                <Link href='/login' passHref legacyBehavior>
                  <Button variant='contained' sx={{ ml: 2 }}>
                    {t('nav.login')} / {t('nav.signup')}
                  </Button>
                </Link>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        {/* Mobile Menu Drawer */}
        <Drawer
          anchor='right'
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          <List sx={{ width: 250 }}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary={t('nav.howItWorks')} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary={t('nav.aboutUs')} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href='/login'>
                <ListItemText primary={`${t('nav.login')} / ${t('nav.signup')}`} />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        {/* Hero Section */}
        <Container maxWidth='lg' sx={{ flexGrow: 1, py: { xs: 6, md: 12 } }}>
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems='center'>
            <Grid item xs={12} md={6}>
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
                  }}
                >
                  <Link href='/signup' passHref legacyBehavior>
                    <Button
                      variant='gradient'
                      size='large'
                      sx={{ flex: { xs: 1, sm: 0 } }}
                    >
                      {t('home.hero.travelerButton')}
                    </Button>
                  </Link>
                  <Link href='/signup' passHref legacyBehavior>
                    <Button
                      variant='orange'
                      size='large'
                      sx={{ flex: { xs: 1, sm: 0 } }}
                    >
                      {t('home.hero.senderButton')}
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
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
            </Grid>
          </Grid>

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

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
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
              </Grid>

              <Grid item xs={12} md={4}>
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
              </Grid>

              <Grid item xs={12} md={4}>
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
              </Grid>
            </Grid>
          </Box>
        </Container>

        {/* Footer */}
        <Box
          component='footer'
          sx={{
            py: 8,
            textAlign: 'center',
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant='body1'
            color='text.secondary'
            sx={{ fontStyle: 'italic', mb: 1 }}
          >
            &quot;{t('home.footer.quote')}&quot;
          </Typography>
          <Typography variant='body2' color='text.disabled'>
            - {t('home.footer.author')}
          </Typography>
          <Box
            sx={{
              mt: 4,
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              flexWrap: 'wrap',
            }}
          >
            <Button
              color='inherit'
              size='small'
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              {t('home.footer.terms')}
            </Button>
            <Button
              color='inherit'
              size='small'
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              {t('home.footer.privacy')}
            </Button>
            <Button
              color='inherit'
              size='small'
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              {t('home.footer.contact')}
            </Button>
          </Box>
          <Typography variant='body2' color='text.disabled' sx={{ mt: 2 }}>
            {t('home.footer.copyright')}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Header for Logged In Users */}
      <NavBar />

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

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
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
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
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
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
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
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
