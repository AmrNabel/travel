'use client';

import { useState } from 'react';
import { IconButton, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NotificationCenter } from './NotificationCenter';
import { useNotifications } from '@/hooks/useNotifications';

export const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{ color: 'text.secondary' }}
        aria-label="Notifications"
        data-testid="notification-bell"
      >
        <Badge badgeContent={unreadCount} color='error'>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <NotificationCenter open={open} onClose={() => setOpen(false)} />
    </>
  );
};
