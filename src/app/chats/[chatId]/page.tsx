'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Container } from '@mui/material';

export default function ChatPage({ params }: { params: { chatId: string } }) {
  return (
    <AuthGuard>
      <Container maxWidth='md' sx={{ mt: 4 }}>
        <ChatWindow chatId={params.chatId} />
      </Container>
    </AuthGuard>
  );
}
