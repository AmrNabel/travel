'use client';

import {
  Container,
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
} from '@mui/material';
import { NavBar } from '@/components/common/NavBar';
import { useLanguage } from '@/contexts/LanguageContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

export default function FAQPage() {
  const { t } = useLanguage();
  const theme = useTheme();

  const faqItems = [
    { key: 'q1' },
    { key: 'q2' },
    { key: 'q3' },
    { key: 'q4' },
    { key: 'q5' },
    { key: 'q6' },
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
      <NavBar />
      <Container maxWidth='lg' sx={{ py: 6, flex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <QuestionAnswerIcon
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
            {t('faq.title')}
          </Typography>
          <Typography
            variant='h6'
            color='text.secondary'
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            {t('faq.subtitle')}
          </Typography>
        </Box>

        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          {faqItems.map((item, index) => (
            <Accordion
              key={item.key}
              sx={{
                mb: 2,
                '&:before': {
                  display: 'none',
                },
                boxShadow: 2,
                borderRadius: 2,
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                sx={{
                  py: 2,
                  px: 3,
                  '& .MuiAccordionSummary-content': {
                    my: 1,
                  },
                }}
              >
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  {t(`faq.${item.key}.question`)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3 }}>
                <Typography variant='body1' color='text.secondary' sx={{ lineHeight: 1.8 }}>
                  {t(`faq.${item.key}.answer`)}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

