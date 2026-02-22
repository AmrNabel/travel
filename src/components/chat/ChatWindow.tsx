'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  useTheme,
  useMediaQuery,
  alpha,
  Avatar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/hooks/useUser';
import { format } from 'date-fns';

interface ChatWindowProps {
  chatId: string;
  canSend?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chatId,
  canSend = true,
}) => {
  const [messageText, setMessageText] = useState('');
  const { messages, sendMessage } = useChat(chatId);
  const { user } = useAuth();
  const { t } = useLanguage();
  const theme = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      await sendMessage({ chatId, text: messageText });
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: { xs: 'calc(100vh - 200px)', sm: '600px' },
        minHeight: { xs: '400px', sm: '600px' },
        maxHeight: { xs: 'calc(100vh - 120px)', sm: '600px' },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Messages List */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: { xs: 1.5, sm: 2 },
          bgcolor: alpha(theme.palette.primary.main, 0.02),
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              py: 4,
            }}
          >
            <Typography variant='body2' color='text.secondary'>
              {t('chat.noChats')}
            </Typography>
            <Typography variant='caption' color='text.disabled' sx={{ mt: 1 }}>
              {t('chat.typeMessage')}
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {messages.map((message) => {
              const isOwn = message.senderId === user?.id;
              return (
                <ListItem
                  key={message.id}
                  sx={{
                    justifyContent: isOwn ? 'flex-end' : 'flex-start',
                    px: { xs: 0.5, sm: 1 },
                    py: 0.5,
                    alignItems: 'flex-end',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: isOwn ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                      gap: 1,
                      maxWidth: { xs: '85%', sm: '70%' },
                    }}
                  >
                    {!isOwn && (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: 'primary.main',
                        }}
                      >
                        {message.senderId?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                    )}
                    <Box
                      sx={{
                        bgcolor: isOwn
                          ? 'primary.main'
                          : alpha(theme.palette.grey[500], 0.1),
                        color: isOwn ? 'white' : 'text.primary',
                        borderRadius: 3,
                        borderTopLeftRadius: isOwn ? 3 : 0,
                        borderTopRightRadius: isOwn ? 0 : 3,
                        p: { xs: 1.25, sm: 1.5 },
                        boxShadow: theme.shadows[1],
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          boxShadow: theme.shadows[2],
                        },
                      }}
                    >
                      <Typography
                        variant='body1'
                        sx={{
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          wordBreak: 'break-word',
                          lineHeight: 1.5,
                        }}
                      >
                        {message.text}
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          opacity: 0.8,
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        }}
                      >
                        {format(message.createdAt, 'HH:mm')}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box
        component='form'
        onSubmit={handleSend}
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        {!canSend && (
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ mb: 1 }}
          >
            {t('chat.startOfferFirst')}
          </Typography>
        )}
        <Box display='flex' gap={1} alignItems='center'>
          <TextField
            fullWidth
            placeholder={t('chat.typeMessage')}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            size='small'
            disabled={!canSend}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
                borderRadius: 3,
                bgcolor: 'background.default',
              },
            }}
          />
          <IconButton
            type='submit'
            color='primary'
            disabled={!canSend || !messageText.trim()}
            sx={{
              flexShrink: 0,
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&.Mui-disabled': {
                bgcolor: alpha(theme.palette.primary.main, 0.3),
                color: 'white',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};
