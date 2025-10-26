'use client';

import { Box, Card, CardContent, Skeleton, Grid } from '@mui/material';

export const TripCardSkeleton = () => (
  <Card elevation={2}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant='text' width='60%' height={32} />
          <Skeleton variant='text' width='40%' height={20} />
        </Box>
        <Skeleton
          variant='rectangular'
          width={60}
          height={24}
          sx={{ borderRadius: 12 }}
        />
      </Box>
      <Skeleton variant='text' width='80%' />
      <Skeleton variant='text' width='70%' />
      <Skeleton variant='text' width='90%' sx={{ mt: 1 }} />
    </CardContent>
  </Card>
);

export const ChatListSkeleton = () => (
  <Box>
    {[1, 2, 3, 4, 5].map((i) => (
      <Box
        key={i}
        sx={{
          display: 'flex',
          gap: 2,
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Skeleton variant='circular' width={56} height={56} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant='text' width='40%' height={24} />
          <Skeleton variant='text' width='80%' height={20} />
        </Box>
      </Box>
    ))}
  </Box>
);

export const ProfileSkeleton = () => (
  <Box>
    <Card elevation={2} sx={{ p: 4, mb: 4 }}>
      <Grid container spacing={3} alignItems='center'>
        <Grid item xs={12} sm='auto'>
          <Skeleton variant='circular' width={120} height={120} />
        </Grid>
        <Grid item xs={12} sm>
          <Skeleton variant='text' width='40%' height={40} />
          <Box sx={{ display: 'flex', gap: 1, my: 2 }}>
            <Skeleton
              variant='rectangular'
              width={80}
              height={24}
              sx={{ borderRadius: 12 }}
            />
            <Skeleton
              variant='rectangular'
              width={120}
              height={24}
              sx={{ borderRadius: 12 }}
            />
          </Box>
          <Skeleton variant='text' width='60%' />
          <Skeleton
            variant='rectangular'
            width={140}
            height={40}
            sx={{ borderRadius: 24, mt: 2 }}
          />
        </Grid>
      </Grid>
    </Card>
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[1, 2, 3].map((i) => (
        <Grid item xs={12} sm={4} key={i}>
          <Card elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Skeleton
              variant='text'
              width='50%'
              height={48}
              sx={{ mx: 'auto' }}
            />
            <Skeleton
              variant='text'
              width='70%'
              height={20}
              sx={{ mx: 'auto' }}
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);
