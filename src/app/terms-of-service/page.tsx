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

export default function TermsOfServicePage() {
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
              {t('legal.terms.title')}
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              {t('legal.terms.lastUpdated')}
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Content */}
          <Box sx={{ '& > *': { mb: 3 } }}>
            <Typography variant='h5' fontWeight={700} gutterBottom>
              {t('legal.terms.section1.title')}
            </Typography>
            <Typography variant='body1' color='text.secondary' paragraph>
              {t('legal.terms.section1.content')}
            </Typography>

            <Typography variant='h5' fontWeight={700} gutterBottom>
              {t('legal.terms.section2.title')}
            </Typography>
            <Typography variant='body1' color='text.secondary' paragraph>
              {t('legal.terms.section2.content')}
            </Typography>

            <Typography variant='h5' fontWeight={700} gutterBottom>
              {t('legal.terms.section3.title')}
            </Typography>
            <Typography variant='body1' color='text.secondary' paragraph>
              {t('legal.terms.section3.content')}
            </Typography>

            <Typography variant='h5' fontWeight={700} gutterBottom>
              {t('legal.terms.section4.title')}
            </Typography>
            <Typography variant='body1' color='text.secondary' paragraph>
              {t('legal.terms.section4.content')}
            </Typography>

            <Typography variant='h5' fontWeight={700} gutterBottom>
              {t('legal.terms.section5.title')}
            </Typography>
            <Typography variant='body1' color='text.secondary' paragraph>
              {t('legal.terms.section5.content')}
            </Typography>

            <Typography variant='h5' fontWeight={700} gutterBottom>
              {t('legal.terms.section6.title')}
            </Typography>
            <Typography variant='body1' color='text.secondary' paragraph>
              {t('legal.terms.section6.content')}
            </Typography>

            <Typography variant='h5' fontWeight={700} gutterBottom>
              {t('legal.terms.section7.title')}
            </Typography>
            <Typography variant='body1' color='text.secondary' paragraph>
              {t('legal.terms.section7.content')}
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant='body2' color='text.secondary' align='center'>
            {t('legal.terms.contact')}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
