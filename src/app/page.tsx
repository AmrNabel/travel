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
import Link from 'next/link';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import NatureIcon from '@mui/icons-material/Nature';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

export default function HomePage() {
  const { user, loading } = useAuth();
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
                Firebase Travel
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
                  How it Works
                </Button>
                <Button
                  color='inherit'
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  About Us
                </Button>
                <Link href='/login' passHref legacyBehavior>
                  <Button variant='contained' sx={{ ml: 2 }}>
                    Login / Sign Up
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
                <ListItemText primary='How it Works' />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary='About Us' />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href='/login'>
                <ListItemText primary='Login / Sign Up' />
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
                  Connect Your Journey. Deliver a Smile.
                </Typography>
                <Typography
                  variant='h5'
                  color='text.secondary'
                  paragraph
                  sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, mb: 4 }}
                >
                  Turn your travel into a rewarding delivery route. Your journey
                  helps someone&apos;s day!
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
                      I&apos;m a Traveler
                    </Button>
                  </Link>
                  <Link href='/signup' passHref legacyBehavior>
                    <Button
                      variant='orange'
                      size='large'
                      sx={{ flex: { xs: 1, sm: 0 } }}
                    >
                      I&apos;m a Sender
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
              A Smarter Way to Travel and Send
            </Typography>
            <Typography
              variant='body1'
              align='center'
              color='text.secondary'
              sx={{ mb: 6, maxWidth: 720, mx: 'auto' }}
            >
              Discover the benefits of a community-powered delivery network.
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
                    Earn on Your Travels
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Monetize your extra luggage space by carrying items for
                    others along your existing travel routes.
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
                    Send with Trust
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Get your items delivered quickly and affordably by a trusted
                    network of peer-to-peer travelers.
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
                    Eco-Friendly Delivery
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Reduce carbon footprint by utilizing space in journeys
                    already being made. Good for you, good for the planet.
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
            &quot;The world is a book and those who do not travel read only one
            page.&quot;
          </Typography>
          <Typography variant='body2' color='text.disabled'>
            - Saint Augustine
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
              Terms of Service
            </Button>
            <Button
              color='inherit'
              size='small'
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Privacy Policy
            </Button>
            <Button
              color='inherit'
              size='small'
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Contact Us
            </Button>
          </Box>
          <Typography variant='body2' color='text.disabled' sx={{ mt: 2 }}>
            © 2024 Firebase Travel. All rights reserved.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header for Logged In Users */}
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
              Firebase Travel
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Link href='/search' passHref legacyBehavior>
              <Button
                color='inherit'
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Search
              </Button>
            </Link>
            <Link href='/add-trip' passHref legacyBehavior>
              <Button
                color='inherit'
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                My Trips
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

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
          Welcome, {user.name}! 👋
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
                  Post a Trip
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Share your travel plans and earn by delivering items
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
                  Request Delivery
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Send items with trusted travelers going your way
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
                  Browse Opportunities
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Find trips and delivery requests that match your plans
                </Typography>
              </Paper>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
