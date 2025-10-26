'use client';

import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Container maxWidth='lg' sx={{ mt: 8 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth='lg' sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant='h2' component='h1' gutterBottom>
            Travel Delivery Platform
          </Typography>
          <Typography variant='h5' color='text.secondary' paragraph>
            Connect travelers with senders for affordable and reliable delivery
          </Typography>

          <Box
            sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}
          >
            <Link href='/login' passHref legacyBehavior>
              <Button variant='contained' size='large'>
                Sign In
              </Button>
            </Link>
            <Link href='/signup' passHref legacyBehavior>
              <Button variant='outlined' size='large'>
                Sign Up
              </Button>
            </Link>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 8 }}>
      <Typography variant='h3' component='h1' gutterBottom>
        Welcome, {user.name}!
      </Typography>

      <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Link href='/add-trip' passHref legacyBehavior>
          <Button variant='contained' size='large'>
            Post a Trip
          </Button>
        </Link>
        <Link href='/send-item' passHref legacyBehavior>
          <Button variant='contained' size='large'>
            Request Delivery
          </Button>
        </Link>
        <Link href='/search' passHref legacyBehavior>
          <Button variant='outlined' size='large'>
            Search
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
