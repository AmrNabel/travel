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
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';

interface ChatWindowProps {
  chatId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const [messageText, setMessageText] = useState('');
  const { messages, sendMessage } = useChat(chatId);
  const { user } = useAuth();
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 1, sm: 2 } }}>
        <List>
          {messages.map((message) => {
            const isOwn = message.senderId === user?.id;
            return (
              <ListItem
                key={message.id}
                sx={{
                  justifyContent: isOwn ? 'flex-end' : 'flex-start',
                  px: { xs: 0.5, sm: 1 },
                }}
              >
                <Box
                  sx={{
                    maxWidth: { xs: '85%', sm: '70%' },
                    bgcolor: isOwn ? 'primary.main' : 'grey.200',
                    color: isOwn ? 'white' : 'text.primary',
                    borderRadius: 2,
                    p: { xs: 1, sm: 1.5 },
                  }}
                >
                  <Typography
                    variant='body1'
                    sx={{
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      wordBreak: 'break-word',
                    }}
                  >
                    {message.text}
                  </Typography>
                  <Typography
                    variant='caption'
                    sx={{
                      opacity: 0.7,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    }}
                  >
                    {format(message.createdAt, 'HH:mm')}
                  </Typography>
                </Box>
              </ListItem>
            );
          })}
        </List>
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box
        component='form'
        onSubmit={handleSend}
        sx={{ p: { xs: 1, sm: 2 }, borderTop: 1, borderColor: 'divider' }}
      >
        <Box display='flex' gap={1}>
          <TextField
            fullWidth
            placeholder={t('chat.typeMessage')}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            size='small'
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
            }}
          />
          <IconButton type='submit' color='primary' sx={{ flexShrink: 0 }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};
