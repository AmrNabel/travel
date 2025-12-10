'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { ChatWindow } from '@/components/chat/ChatWindow';
import {
  Container,
  Box,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { useUser } from '@/hooks/useUser';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { chats } = useChat();

  // Find the chat to get the other participant
  const chat = chats.find((c) => c.id === params.chatId);
  const otherUserId = chat?.participants.find((id) => id !== user?.id);
  const { user: otherUser, loading: userLoading } = useUser(otherUserId);

  return (
    <AuthGuard>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth='md' sx={{ py: { xs: 2, sm: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: { xs: 2, sm: 3 },
              gap: 2,
            }}
          >
            <IconButton onClick={() => router.back()}>
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant='h5'
              fontWeight={700}
              sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
            >
              {userLoading ? (
                <CircularProgress size={20} />
              ) : (
                otherUser?.name || otherUserId?.slice(0, 8) || t('chat.chat')
              )}
            </Typography>
          </Box>
          <ChatWindow chatId={params.chatId} />
        </Container>
      </Box>
    </AuthGuard>
  );
}
