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
import { useLanguage } from '@/contexts/LanguageContext';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import {
  recalculateUserRatings,
  recalculateAllUserRatings,
} from '@/utils/recalculateRatings';

export default function RatingsAdminPage() {
  const { t } = useLanguage();
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
        message: t('admin.enterUserIdPrompt'),
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const stats = await recalculateUserRatings(userId.trim());
      setResult({
        type: 'success',
        message: t('admin.recalculateSuccess', { rating: stats.rating.toFixed(1), total: stats.totalRatings }),
      });
      setUserId('');
    } catch (error: any) {
      setResult({
        type: 'error',
        message: t('admin.recalculateError', { message: error.message }),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculateAll = async () => {
    if (
      !confirm(
        t('admin.confirmRecalculateAll')
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
        message: t('admin.recalculateAllSuccess', { updated: stats.updated, errors: stats.errors }),
      });
    } catch (error: any) {
      setResult({
        type: 'error',
        message: t('admin.recalculateError', { message: error.message }),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth='md' sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant='h4' fontWeight={700} gutterBottom>
                ⚙️ {t('admin.ratingStats')}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {t('admin.ratingStatsDesc')}
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
                {t('admin.recalculateSingle')}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                {t('admin.singleUserDesc')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                  label={t('admin.userId')}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder={t('admin.enterUserId')}
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
                  {loading ? t('admin.processing') : t('admin.recalculate')}
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Recalculate All Users */}
            <Box>
              <Typography variant='h6' fontWeight={600} gutterBottom>
                <GroupIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                {t('admin.recalculateAll')}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                {t('admin.allUsersDesc')}
              </Typography>
              <Alert severity='warning' sx={{ mb: 2 }}>
                <strong>{t('admin.warningTitle')}</strong> {t('admin.warningMessage')}
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
                {loading ? t('admin.processingAll') : t('admin.recalculateAll')}
              </Button>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Instructions */}
            <Box sx={{ bgcolor: 'action.hover', p: 3, borderRadius: 2 }}>
              <Typography variant='subtitle2' fontWeight={600} gutterBottom>
                {t('admin.howToUse')}
              </Typography>
              <Typography variant='body2' component='div' sx={{ pl: 2 }}>
                <ul style={{ margin: 0 }}>
                  <li>{t('admin.howToUseSingle')}</li>
                  <li>{t('admin.howToUseAll')}</li>
                  <li>{t('admin.whenToUse')}</li>
                  <li>{t('admin.weeklyMaintenance')}</li>
                </ul>
              </Typography>
            </Box>

            {/* Quick Access Info */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
              <Typography variant='caption' color='text.secondary'>
                {t('admin.tip')}
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </AuthGuard>
  );
}
