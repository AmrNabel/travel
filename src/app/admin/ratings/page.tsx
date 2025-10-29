'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  CircularProgress,
  TextField,
  Divider,
} from '@mui/material';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { NavBar } from '@/components/common/NavBar';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import {
  recalculateUserRatings,
  recalculateAllUserRatings,
} from '@/utils/recalculateRatings';

export default function RatingsAdminPage() {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [result, setResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleRecalculateUser = async () => {
    if (!userId.trim()) {
      setResult({
        type: 'error',
        message: 'Please enter a user ID',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const stats = await recalculateUserRatings(userId.trim());
      setResult({
        type: 'success',
        message: `✅ Successfully updated! Rating: ${stats.rating.toFixed(1)}, Total: ${stats.totalRatings}`,
      });
      setUserId('');
    } catch (error: any) {
      setResult({
        type: 'error',
        message: `❌ Error: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculateAll = async () => {
    if (
      !confirm(
        'This will recalculate ratings for ALL users. This may take a while. Continue?'
      )
    ) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const stats = await recalculateAllUserRatings();
      setResult({
        type: 'success',
        message: `✅ Recalculation complete! Updated: ${stats.updated}, Errors: ${stats.errors}`,
      });
    } catch (error: any) {
      setResult({
        type: 'error',
        message: `❌ Error: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <NavBar />
        <Container maxWidth='md' sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant='h4' fontWeight={700} gutterBottom>
                ⚙️ Rating Statistics Admin
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Manually recalculate user rating statistics
              </Typography>
            </Box>

            {result && (
              <Alert
                severity={result.type}
                onClose={() => setResult(null)}
                sx={{ mb: 3 }}
              >
                {result.message}
              </Alert>
            )}

            {/* Recalculate Single User */}
            <Box sx={{ mb: 4 }}>
              <Typography variant='h6' fontWeight={600} gutterBottom>
                <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Recalculate Single User
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                Enter a user ID to recalculate their rating statistics
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                  label='User ID'
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder='Enter user ID'
                  fullWidth
                  size='small'
                  disabled={loading}
                />
                <Button
                  variant='contained'
                  startIcon={
                    loading ? (
                      <CircularProgress size={16} color='inherit' />
                    ) : (
                      <RefreshIcon />
                    )
                  }
                  onClick={handleRecalculateUser}
                  disabled={loading}
                  sx={{ minWidth: 150 }}
                >
                  {loading ? 'Processing...' : 'Recalculate'}
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Recalculate All Users */}
            <Box>
              <Typography variant='h6' fontWeight={600} gutterBottom>
                <GroupIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Recalculate All Users
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                Recalculate rating statistics for all users in the system. This
                may take a while.
              </Typography>
              <Alert severity='warning' sx={{ mb: 2 }}>
                <strong>Warning:</strong> This will process all users and may
                take several minutes depending on the number of users.
              </Alert>
              <Button
                variant='contained'
                color='primary'
                startIcon={
                  loading ? (
                    <CircularProgress size={16} color='inherit' />
                  ) : (
                    <RefreshIcon />
                  )
                }
                onClick={handleRecalculateAll}
                disabled={loading}
                size='large'
              >
                {loading ? 'Processing All Users...' : 'Recalculate All Users'}
              </Button>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Instructions */}
            <Box sx={{ bgcolor: 'action.hover', p: 3, borderRadius: 2 }}>
              <Typography variant='subtitle2' fontWeight={600} gutterBottom>
                📋 How to Use:
              </Typography>
              <Typography variant='body2' component='div' sx={{ pl: 2 }}>
                <ul style={{ margin: 0 }}>
                  <li>
                    <strong>Single User:</strong> Enter a user ID and click
                    "Recalculate" to update their stats
                  </li>
                  <li>
                    <strong>All Users:</strong> Click "Recalculate All Users" to
                    update everyone's stats
                  </li>
                  <li>
                    <strong>When to Use:</strong> Run this when rating stats
                    appear incorrect or after data migration
                  </li>
                  <li>
                    <strong>Weekly Maintenance:</strong> You can run
                    "Recalculate All Users" once a week to ensure data
                    consistency
                  </li>
                </ul>
              </Typography>
            </Box>

            {/* Quick Access Info */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
              <Typography variant='caption' color='text.secondary'>
                <strong>💡 Tip:</strong> To find a user ID, go to their profile
                page and check the URL. The ID is the last part: /profile/
                <strong>USER_ID</strong>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </AuthGuard>
  );
}
