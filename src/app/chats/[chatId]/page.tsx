'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { ChatWindow } from '@/components/chat/ChatWindow';
import {
  Container,
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Avatar,
  Paper,
  alpha,
  useTheme,
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
  const theme = useTheme();

  // Find the chat to get the other participant
  const chat = chats.find((c) => c.id === params.chatId);
  const otherUserId = chat?.participants.find((id) => id !== user?.id);
  const { user: otherUser, loading: userLoading } = useUser(otherUserId);

  return (
    <AuthGuard>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth='md' sx={{ py: { xs: 2, sm: 4 } }}>
          <Paper
            elevation={2}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              mb: { xs: 2, sm: 3 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: { xs: 1.5, sm: 2 },
                gap: 2,
                bgcolor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <IconButton
                onClick={() => router.back()}
                sx={{
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              {userLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  <CircularProgress size={24} />
                  <Typography
                    variant='h6'
                    fontWeight={600}
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                  >
                    {t('common.loading')}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  <Avatar
                    sx={{
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                      bgcolor: otherUser?.photoURL ? 'transparent' : 'primary.main',
                    }}
                    src={otherUser?.photoURL}
                  >
                    {otherUser?.name?.charAt(0).toUpperCase() || t('chat.userPrefix')}
                  </Avatar>
                  <Typography
                    variant='h6'
                    fontWeight={600}
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                  >
                    {otherUser?.name || t('chat.userPrefix')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
          <ChatWindow chatId={params.chatId} />
        </Container>
      </Box>
    </AuthGuard>
  );
}
