'use client';

import { Box, Card, CardContent, Skeleton } from '@mui/material';

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

export const RequestCardSkeleton = () => (
  <Card
    elevation={2}
    sx={{
      borderRadius: 3,
      mb: 2,
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant='circular' width={48} height={48} />
            <Box>
              <Skeleton variant='text' width={120} height={24} />
              <Skeleton variant='text' width={80} height={16} sx={{ mt: 0.5 }} />
            </Box>
          </Box>
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 auto' }, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <Skeleton variant='text' width={60} height={24} />
            <Skeleton variant='text' width={40} height={24} />
            <Skeleton variant='text' width={60} height={24} />
          </Box>
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
          <Skeleton
            variant='rectangular'
            width={80}
            height={24}
            sx={{ borderRadius: 12 }}
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
          <Skeleton
            variant='rectangular'
            width={100}
            height={24}
            sx={{ borderRadius: 12 }}
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
          <Skeleton variant='text' width={60} height={20} />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
          <Skeleton variant='text' width={80} height={20} />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' }, minWidth: 0 }}>
          <Skeleton
            variant='rectangular'
            width={140}
            height={36}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export const ProfileSkeleton = () => (
  <Box>
    <Card elevation={2} sx={{ p: 4, mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          alignItems: 'center',
        }}
      >
        <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
          <Skeleton variant='circular' width={120} height={120} />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 auto' }, minWidth: 0 }}>
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
        </Box>
      </Box>
    </Card>
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        mb: 4,
      }}
    >
      {[1, 2, 3].map((i) => (
        <Box
          key={i}
          sx={{
            flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 16px)' },
            minWidth: 0,
          }}
        >
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
        </Box>
      ))}
    </Box>
  </Box>
);
