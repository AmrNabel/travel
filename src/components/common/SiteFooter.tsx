'use client';

import Link from 'next/link';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { Box, Button, Typography } from '@mui/material';
import { useLanguage } from '@/contexts/LanguageContext';

export const SiteFooter = () => {
  const { t } = useLanguage();

  return (
    <Box
      component='footer'
      sx={{
        py: { xs: 4, md: 6 },
        px: 2,
        textAlign: 'center',
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        mt: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          mb: 2,
          flexWrap: 'wrap',
        }}
      >
        <FlightTakeoffIcon sx={{ color: 'primary.main' }} />
        <Typography variant='h6' fontWeight={700} color='text.primary'>
          {t('common.appName')}
        </Typography>
      </Box>

      <Typography
        variant='body2'
        color='text.secondary'
        sx={{ fontStyle: 'italic', maxWidth: 640, mx: 'auto' }}
      >
        “{t('home.footer.quote')}” — {t('home.footer.author')}
      </Typography>

      <Box
        sx={{
          mt: 3,
          display: 'flex',
          justifyContent: 'center',
          gap: 3,
          flexWrap: 'wrap',
        }}
      >
        <Link href='/about-us' passHref legacyBehavior>
          <Button
            size='small'
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            {t('nav.aboutUs')}
          </Button>
        </Link>
        <Link href='/faq' passHref legacyBehavior>
          <Button
            size='small'
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            {t('nav.faq')}
          </Button>
        </Link>
        <Link href='/contact-us' passHref legacyBehavior>
          <Button
            size='small'
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            {t('home.footer.contact')}
          </Button>
        </Link>
        <Link href='/terms-of-service' passHref legacyBehavior>
          <Button
            size='small'
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            {t('home.footer.terms')}
          </Button>
        </Link>
        <Link href='/privacy-policy' passHref legacyBehavior>
          <Button
            size='small'
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            {t('home.footer.privacy')}
          </Button>
        </Link>
      </Box>

      <Typography variant='body2' color='text.disabled' sx={{ mt: 3 }}>
        {t('home.footer.copyright')}
      </Typography>
    </Box>
  );
};
