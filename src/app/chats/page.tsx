'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  alpha,
  useTheme,
} from '@mui/material';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ChatIcon from '@mui/icons-material/Chat';
import { format } from 'date-fns';

function ChatsPageContent() {
  const { chats, loading } = useChat();
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const theme = useTheme();

  const handleChatClick = (chatId: string) => {
    router.push(`/chats/${chatId}`);
  };

  const getOtherParticipantId = (participants: string[]) => {
    return participants.find((id) => id !== user?.id);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (chats.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          p: 4,
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <ChatIcon sx={{ fontSize: 60, color: 'primary.main' }} />
        </Box>
        <Typography variant='h5' gutterBottom fontWeight={700}>
          {t('chat.noChats')}
        </Typography>
        <Typography
          variant='body1'
          color='text.secondary'
          sx={{ maxWidth: 400 }}
        >
          {t('chat.noChatsDesc')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant='h3'
        gutterBottom
        fontWeight={800}
        sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, mb: 4 }}
      >
        {t('chat.messages')}
      </Typography>

      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <List sx={{ p: 0 }}>
          {chats.map((chat, index) => {
            const otherUserId = getOtherParticipantId(chat.participants);
            const hasUnread = false; // TODO: Implement unread message tracking

            return (
              <Box key={chat.id}>
                {index > 0 && <Divider />}
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleChatClick(chat.id)}
                    sx={{
                      py: 2,
                      px: 3,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          border: hasUnread ? 2 : 0,
                          borderColor: 'primary.main',
                        }}
                      >
                        {otherUserId?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant='subtitle1'
                            fontWeight={hasUnread ? 700 : 600}
                          >
                            User {otherUserId?.slice(0, 8)}
                          </Typography>
                          {chat.lastMessageAt && (
                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              {format(chat.lastMessageAt, 'MMM d, h:mm a')}
                            </Typography>
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontWeight: hasUnread ? 600 : 400,
                            }}
                          >
                            {chat.lastMessage || t('chat.noChats')}
                          </Typography>
                          {(chat.tripId || chat.requestId) && (
                            <Chip
                              label={chat.tripId ? 'Trip' : 'Request'}
                              size='small'
                              sx={{
                                mt: 1,
                                height: 20,
                                fontSize: '0.75rem',
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: 'primary.main',
                              }}
                            />
                          )}
                        </Box>
                      }
                    />
                    {hasUnread && (
                      <Chip
                        label='New'
                        color='primary'
                        size='small'
                        sx={{ ml: 1 }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </Box>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}

export default function ChatsPage() {
  return (
    <AuthGuard>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth='lg' sx={{ py: 4 }}>
          <ChatsPageContent />
        </Container>
      </Box>
    </AuthGuard>
  );
}
