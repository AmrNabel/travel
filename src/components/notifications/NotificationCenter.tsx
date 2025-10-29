'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Button,
  Divider,
  Tabs,
  Tab,
  Badge,
  Avatar,
  alpha,
  useTheme,
} from '@mui/material';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/types/notification';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MessageIcon from '@mui/icons-material/Message';
import StarIcon from '@mui/icons-material/Star';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  open,
  onClose,
}) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [filter, setFilter] = useState<
    'all' | 'offers' | 'messages' | 'updates'
  >('all');
  const router = useRouter();
  const theme = useTheme();

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'all') return true;
    if (filter === 'offers') return notif.type.includes('offer');
    if (filter === 'messages') return notif.type === 'message_received';
    if (filter === 'updates')
      return notif.type.includes('status') || notif.type.includes('review');
    return true;
  });

  const getNotificationIcon = (type: string) => {
    if (type.includes('offer')) return <LocalOfferIcon />;
    if (type.includes('message')) return <MessageIcon />;
    if (type.includes('review')) return <StarIcon />;
    return <NotificationsIcon />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error.main';
      case 'medium':
        return 'warning.main';
      default:
        return 'info.main';
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      onClose();
    }
  };

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant='h6' fontWeight={700}>
              Notifications
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {unreadCount} unread
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {unreadCount > 0 && (
              <Button size='small' onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
            <IconButton onClick={onClose} size='small'>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Filters */}
        <Tabs
          value={filter}
          onChange={(_, value) => setFilter(value)}
          variant='fullWidth'
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label='All' value='all' />
          <Tab label='Offers' value='offers' />
          <Tab label='Messages' value='messages' />
          <Tab label='Updates' value='updates' />
        </Tabs>

        {/* Notifications List */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {filteredNotifications.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                p: 4,
              }}
            >
              <NotificationsIcon
                sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
              />
              <Typography variant='h6' color='text.secondary'>
                No notifications
              </Typography>
              <Typography variant='body2' color='text.disabled'>
                You're all caught up!
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredNotifications.map((notification) => (
                <Box key={notification.id}>
                  <ListItemButton
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      py: 2,
                      px: 2,
                      bgcolor: notification.read
                        ? 'transparent'
                        : alpha(theme.palette.primary.main, 0.05),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                      {/* Icon */}
                      <Badge
                        color='error'
                        variant='dot'
                        invisible={notification.read}
                      >
                        <Avatar
                          sx={{
                            bgcolor: alpha(
                              theme.palette[
                                notification.priority === 'high'
                                  ? 'error'
                                  : notification.priority === 'medium'
                                    ? 'warning'
                                    : 'info'
                              ].main,
                              0.1
                            ),
                            color: getPriorityColor(notification.priority),
                          }}
                        >
                          {getNotificationIcon(notification.type)}
                        </Avatar>
                      </Badge>

                      {/* Content */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant='subtitle2'
                          fontWeight={notification.read ? 400 : 700}
                          sx={{ mb: 0.5 }}
                        >
                          {notification.title}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography variant='caption' color='text.disabled'>
                          {formatDistanceToNow(notification.createdAt, {
                            addSuffix: true,
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItemButton>
                  <Divider />
                </Box>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};
