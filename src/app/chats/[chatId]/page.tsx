'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { NavBar } from '@/components/common/NavBar';
import { Container, Box, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <AuthGuard>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <NavBar />
        <Container maxWidth='md' sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
            <IconButton onClick={() => router.back()}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant='h5' fontWeight={700}>
              {t('chat.chat')}
            </Typography>
          </Box>
          <ChatWindow chatId={params.chatId} />
        </Container>
      </Box>
    </AuthGuard>
  );
}
