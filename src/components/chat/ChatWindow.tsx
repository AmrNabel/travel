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
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface ChatWindowProps {
  chatId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const [messageText, setMessageText] = useState('');
  const { messages, sendMessage } = useChat(chatId);
  const { user } = useAuth();
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
      sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}
    >
      {/* Messages List */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <List>
          {messages.map((message) => {
            const isOwn = message.senderId === user?.id;
            return (
              <ListItem
                key={message.id}
                sx={{
                  justifyContent: isOwn ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    bgcolor: isOwn ? 'primary.main' : 'grey.200',
                    color: isOwn ? 'white' : 'text.primary',
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  <Typography variant='body1'>{message.text}</Typography>
                  <Typography variant='caption' sx={{ opacity: 0.7 }}>
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
        sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}
      >
        <Box display='flex' gap={1}>
          <TextField
            fullWidth
            placeholder='Type a message...'
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            size='small'
          />
          <IconButton type='submit' color='primary'>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};
