'use client';

import {
  Container,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import { useLanguage } from '@/contexts/LanguageContext';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import MissionIcon from '@mui/icons-material/Flag';
import VisionIcon from '@mui/icons-material/Visibility';
import TrustIcon from '@mui/icons-material/VerifiedUser';
import CommunityIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import AccessibleIcon from '@mui/icons-material/Accessibility';
import Step1Icon from '@mui/icons-material/Person';
import Step2Icon from '@mui/icons-material/Send';
import Step3Icon from '@mui/icons-material/CheckCircle';

export default function AboutUsPage() {
  const { t } = useLanguage();
  const theme = useTheme();

  const values = [
    { key: 'trust', icon: TrustIcon },
    { key: 'community', icon: CommunityIcon },
    { key: 'sustainability', icon: PublicIcon },
    { key: 'accessibility', icon: AccessibleIcon },
  ];

  const steps = [
    { key: 'step1', icon: Step1Icon },
    { key: 'step2', icon: Step2Icon },
    { key: 'step3', icon: Step3Icon },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      }}
    >
      <Container maxWidth='lg' sx={{ py: 6, flex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <FlightTakeoffIcon
            sx={{
              fontSize: 60,
              color: 'primary.main',
              mb: 2,
            }}
          />
          <Typography
            variant='h3'
            component='h1'
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            {t('aboutUs.title')}
          </Typography>
          <Typography
            variant='h6'
            color='text.secondary'
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            {t('aboutUs.subtitle')}
          </Typography>
        </Box>

        {/* Mission & Vision */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            mb: 8,
          }}
        >
          <Box
            sx={{
              flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' },
              minWidth: 0,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              }}
            >
              <MissionIcon
                sx={{
                  fontSize: 40,
                  color: 'primary.main',
                  mb: 2,
                }}
              />
              <Typography variant='h5' gutterBottom sx={{ fontWeight: 600 }}>
                {t('aboutUs.mission.title')}
              </Typography>
              <Typography
                variant='body1'
                color='text.secondary'
                sx={{ lineHeight: 1.8 }}
              >
                {t('aboutUs.mission.description')}
              </Typography>
            </Paper>
          </Box>
          <Box
            sx={{
              flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' },
              minWidth: 0,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              }}
            >
              <VisionIcon
                sx={{
                  fontSize: 40,
                  color: 'secondary.main',
                  mb: 2,
                }}
              />
              <Typography variant='h5' gutterBottom sx={{ fontWeight: 600 }}>
                {t('aboutUs.vision.title')}
              </Typography>
              <Typography
                variant='body1'
                color='text.secondary'
                sx={{ lineHeight: 1.8 }}
              >
                {t('aboutUs.vision.description')}
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* Values */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant='h4'
            gutterBottom
            sx={{ textAlign: 'center', fontWeight: 600, mb: 4 }}
          >
            {t('aboutUs.values.title')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
            }}
          >
            {values.map((value) => {
              const IconComponent = value.icon;
              return (
                <Box
                  key={value.key}
                  sx={{
                    flex: {
                      xs: '1 1 100%',
                      sm: '1 1 calc(50% - 12px)',
                      md: '1 1 calc(25% - 18px)',
                    },
                    minWidth: 0,
                  }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent>
                      <IconComponent
                        sx={{
                          fontSize: 50,
                          color: 'primary.main',
                          mb: 2,
                        }}
                      />
                      <Typography
                        variant='h6'
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        {t(`aboutUs.values.${value.key}.title`)}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {t(`aboutUs.values.${value.key}.description`)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* How It Works */}
        <Box>
          <Typography
            variant='h4'
            gutterBottom
            sx={{ textAlign: 'center', fontWeight: 600, mb: 4 }}
          >
            {t('aboutUs.howItWorks.title')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
            }}
          >
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Box
                  key={step.key}
                  sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 22px)' },
                    minWidth: 0,
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: 4,
                      height: '100%',
                      textAlign: 'center',
                      borderRadius: 3,
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 18,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <IconComponent
                      sx={{
                        fontSize: 50,
                        color: 'primary.main',
                        mb: 2,
                        mt: 2,
                      }}
                    />
                    <Typography
                      variant='h6'
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {t(`aboutUs.howItWorks.${step.key}.title`)}
                    </Typography>
                    <Typography
                      variant='body1'
                      color='text.secondary'
                      sx={{ lineHeight: 1.8 }}
                    >
                      {t(`aboutUs.howItWorks.${step.key}.description`)}
                    </Typography>
                  </Paper>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
