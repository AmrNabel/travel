'use client';

import {
  Container,
  Box,
  Typography,
  Paper,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import { useLanguage } from '@/contexts/LanguageContext';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
      <Container maxWidth='md'>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 3,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <FlightTakeoffIcon
              sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}
            />
            <Typography
              variant='h3'
              component='h1'
              gutterBottom
              fontWeight={800}
            >
              {t('legal.privacy.title')}
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              {t('legal.privacy.lastUpdated')}
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Content */}
          <Box sx={{ '& > *': { mb: 3 } }}>
            <Typography variant='h5' fontWeight={700} gutterBottom>
              {t('legal.privacy.section1.title')}
            </Typography>
            <Typography variant='body1' color='text.secondary' paragraph>
              {t('legal.privacy.section1.content')}
            </Typography>

            <Typography variant='h5' fontWeight={700} gutterBottom>
              {t('legal.privacy.section2.title')}
            </Typography>
            <Typography variant='body1' color='text.secondary' paragraph>
              {t('legal.privacy.section2.content')}
            </Typography>

            <Typography variant='h5' fontWeight={700} gutterBottom>
              {t('legal.privacy.section3.title')}
            </Typography>
            <Typography variant='body1' color='text.secondary' paragraph>
              {t('legal.privacy.section3.content')}
            </Typography>

            <Typography variant='h5' fontWeight={700} gutterBottom>
              {t('legal.privacy.section4.title')}
            </Typography>
            <Typography variant='body1' color='text.secondary' paragraph>
              {t('legal.privacy.section4.content')}
            </Typography>

            <Typography variant='h5' fontWeight={700} gutterBottom>
              {t('legal.privacy.section5.title')}
            </Typography>
            <Typography variant='body1' color='text.secondary' paragraph>
              {t('legal.privacy.section5.content')}
            </Typography>

            <Typography variant='h5' fontWeight={700} gutterBottom>
              {t('legal.privacy.section6.title')}
            </Typography>
            <Typography variant='body1' color='text.secondary' paragraph>
              {t('legal.privacy.section6.content')}
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant='body2' color='text.secondary' align='center'>
            {t('legal.privacy.contact')}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
