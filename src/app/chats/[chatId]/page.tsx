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
  Button,
  Tooltip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { useUser } from '@/hooks/useUser';
import { useNotification } from '@/contexts/NotificationContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { chats } = useChat();
  const theme = useTheme();
  const { showNotification } = useNotification();

  // Find the chat to get the other participant
  const chat = chats.find((c) => c.id === params.chatId);
  const otherUserId = chat?.participants.find((id) => id !== user?.id);
  const { user: otherUser, loading: userLoading } = useUser(otherUserId);

  const handleProfileClick = () => {
    if (otherUserId) {
      router.push(`/profile/${otherUserId}`);
    }
  };

  const handleCallClick = () => {
    if (!otherUser?.phone) {
      showNotification(t('chat.noPhoneNumber'), 'warning');
      return;
    }

    // Try to initiate a call, fallback to copying phone number
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      // iOS - use tel: link
      window.location.href = `tel:${otherUser.phone}`;
    } else if (navigator.userAgent.match(/Android/i)) {
      // Android - use tel: link
      window.location.href = `tel:${otherUser.phone}`;
    } else {
      // Desktop or other - copy phone number to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(otherUser.phone)
          .then(() => {
            showNotification(
              t('chat.phoneNumberCopied', { phone: otherUser.phone }),
              'success'
            );
          })
          .catch(() => {
            // Fallback: show phone number in notification if clipboard fails
            showNotification(
              `${t('chat.callUser', { name: otherUser.name })}: ${otherUser.phone}`,
              'info'
            );
          });
      } else {
        // Fallback for browsers without clipboard API
        showNotification(
          `${t('chat.callUser', { name: otherUser.name })}: ${otherUser.phone}`,
          'info'
        );
      }
    }
  };

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
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flex: 1,
                  }}
                >
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
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      flex: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.8,
                      },
                    }}
                    onClick={handleProfileClick}
                  >
                    <Avatar
                      sx={{
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                        bgcolor: otherUser?.photoURL
                          ? 'transparent'
                          : 'primary.main',
                      }}
                      src={otherUser?.photoURL}
                    >
                      {otherUser?.name?.charAt(0).toUpperCase() ||
                        t('chat.userPrefix')}
                    </Avatar>
                    <Typography
                      variant='h6'
                      fontWeight={600}
                      sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                    >
                      {otherUser?.name || t('chat.userPrefix')}
                    </Typography>
                  </Box>
                  {otherUser?.phone && (
                    <Tooltip
                      title={t('chat.callUser', { name: otherUser.name })}
                    >
                      <Button
                        variant='outlined'
                        size='small'
                        startIcon={<PhoneIcon />}
                        onClick={handleCallClick}
                        sx={{
                          display: { xs: 'none', sm: 'flex' },
                          alignItems: 'center',
                          gap: 1,
                          textTransform: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t('chat.callUser', { name: otherUser.name })}
                      </Button>
                    </Tooltip>
                  )}
                  {otherUser?.phone && (
                    <Tooltip
                      title={t('chat.callUser', { name: otherUser.name })}
                    >
                      <IconButton
                        onClick={handleCallClick}
                        sx={{
                          display: { xs: 'flex', sm: 'none' },
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                          },
                        }}
                      >
                        <PhoneIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
            </Box>
          </Paper>
          <ChatWindow chatId={params.chatId} />
        </Container>
      </Box>
    </AuthGuard>
  );
}
