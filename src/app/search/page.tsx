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
} from '@mui/material';
import { useTrips } from '@/hooks/useTrips';
import { useRequests } from '@/hooks/useRequests';
import { TripCard } from '@/components/trips/TripCard';
import { RequestCard } from '@/components/requests/RequestCard';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useState({
    fromCity: '',
    toCity: '',
  });
  const [activeTab, setActiveTab] = useState(0);

  const { trips, loading: tripsLoading } = useTrips(searchParams);
  const { requests, loading: requestsLoading } = useRequests(searchParams);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is reactive, so this just triggers re-query
  };

  return (
    <Container maxWidth='lg' sx={{ mt: 4 }}>
      <Typography variant='h4' gutterBottom>
        Search
      </Typography>

      <Box component='form' onSubmit={handleSearch} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <TextField
              label='From City'
              value={searchParams.fromCity}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  fromCity: e.target.value,
                }))
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              label='To City'
              value={searchParams.toCity}
              onChange={(e) =>
                setSearchParams((prev) => ({ ...prev, toCity: e.target.value }))
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              type='submit'
              variant='contained'
              fullWidth
              sx={{ height: '56px' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ mb: 2 }}
      >
        <Tab label='Trips' />
        <Tab label='Requests' />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          {tripsLoading ? (
            <Typography>Loading...</Typography>
          ) : trips.length === 0 ? (
            <Typography>No trips found</Typography>
          ) : (
            trips.map((trip) => <TripCard key={trip.id} trip={trip} />)
          )}
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          {requestsLoading ? (
            <Typography>Loading...</Typography>
          ) : requests.length === 0 ? (
            <Typography>No requests found</Typography>
          ) : (
            requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </Box>
      )}
    </Container>
  );
}
