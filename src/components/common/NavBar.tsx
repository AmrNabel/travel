'use client';

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LuggageIcon from '@mui/icons-material/Luggage';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { LanguageSwitcher } from './LanguageSwitcher';

type InitialUser = {
  id: string;
  name: string;
  email: string | null;
  photoURL?: string | null;
};

interface NavBarProps {
  initialUser?: InitialUser | null;
}

export const NavBar = ({ initialUser = null }: NavBarProps) => {
  const { user, loading, signOut } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  const effectiveUser = loading ? (user ?? initialUser) : (user ?? null);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      setUserMenuAnchor(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  if (!effectiveUser) {
    // Not authenticated navbar
    return (
      <AppBar position='sticky' elevation={0}>
        <Toolbar sx={{ py: 1 }}>
          <Link href='/' style={{ textDecoration: 'none', flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FlightTakeoffIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography
                variant='h6'
                sx={{ fontWeight: 700, color: 'text.primary' }}
              >
                {t('common.appName')}
              </Typography>
            </Box>
          </Link>
          {isMobile ? (
            <>
              <LanguageSwitcher />
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{ color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <LanguageSwitcher />
              <Link href='/login' passHref legacyBehavior>
                <Button
                  variant='outlined'
                  sx={{
                    borderRadius: '9999px',
                    px: 3,
                  }}
                >
                  {t('nav.login')}
                </Button>
              </Link>
              <Link href='/signup' passHref legacyBehavior>
                <Button
                  variant='gradient'
                  sx={{
                    borderRadius: '9999px',
                    px: 3,
                  }}
                >
                  {t('nav.signup')}
                </Button>
              </Link>
            </Box>
          )}
        </Toolbar>

        <Drawer
          anchor='right'
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          <Box sx={{ width: 280, pt: 2 }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} href='/login' sx={{ gap: 2 }}>
                  <ListItemIcon sx={{ minWidth: 'auto' }}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('nav.login')} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} href='/signup' sx={{ gap: 2 }}>
                  <ListItemIcon sx={{ minWidth: 'auto' }}>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('nav.signup')} />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </AppBar>
    );
  }

  // Authenticated navbar
  return (
    <AppBar position='sticky' elevation={0}>
      <Toolbar sx={{ py: 1 }}>
        <Link href='/' style={{ textDecoration: 'none', flexGrow: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <FlightTakeoffIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography
              variant='h6'
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              {t('common.appName')}
            </Typography>
          </Box>
        </Link>

        {isMobile ? (
          <>
            <NotificationBell />
            <LanguageSwitcher />
            <IconButton
              onClick={() => setMobileMenuOpen(true)}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Link href='/search' passHref legacyBehavior>
              <Button
                color='inherit'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <SearchIcon fontSize='small' />
                {t('nav.search')}
              </Button>
            </Link>
            <Link href='/my-trips' passHref legacyBehavior>
              <Button
                color='inherit'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <DashboardIcon fontSize='small' />
                {t('nav.myTrips')}
              </Button>
            </Link>
            <Link href='/offers' passHref legacyBehavior>
              <Button
                color='inherit'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <LocalOfferIcon fontSize='small' />
                {t('nav.offers')}
              </Button>
            </Link>
            <Link href='/chats' passHref legacyBehavior>
              <Button
                color='inherit'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <ChatIcon fontSize='small' />
                {t('nav.messages')}
              </Button>
            </Link>
            <Link href='/add-trip' passHref legacyBehavior>
              <Button
                variant='gradient'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  borderRadius: '9999px',
                  px: 3,
                }}
              >
                <FlightTakeoffIcon fontSize='small' />
                {t('nav.postTrip')}
              </Button>
            </Link>
            <Link href='/send-item' passHref legacyBehavior>
              <Button
                variant='orange'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  borderRadius: '9999px',
                  px: 3,
                }}
              >
                <LuggageIcon fontSize='small' />
                {t('nav.sendItem')}
              </Button>
            </Link>

            <NotificationBell />
            <LanguageSwitcher />

            <IconButton onClick={handleUserMenuOpen} sx={{ ml: 1 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'primary.main',
                  fontSize: '1rem',
                }}
              >
                {effectiveUser.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: { mt: 1.5, minWidth: 200 },
              }}
            >
              <Box
                sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}
              >
                <Typography variant='subtitle2' fontWeight={600}>
                  {effectiveUser.name}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {effectiveUser.email}
                </Typography>
              </Box>
              <MenuItem
                component={Link}
                href={`/profile/${effectiveUser.id}`}
                onClick={handleUserMenuClose}
                sx={{ py: 1.5, gap: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  <PersonIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText>{t('nav.profile')}</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleSignOut}
                sx={{ py: 1.5, color: 'error.main', gap: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  <LogoutIcon fontSize='small' color='error' />
                </ListItemIcon>
                <ListItemText>{t('nav.logout')}</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor='right'
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 280, pt: 2 }}>
          <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: 'primary.main',
                  fontSize: '1.25rem',
                }}
              >
                {effectiveUser.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant='subtitle1' fontWeight={600}>
                  {effectiveUser.name}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {effectiveUser.email}
                </Typography>
              </Box>
            </Box>
          </Box>

          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} href='/search' sx={{ gap: 2 }}>
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText primary={t('nav.search')} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href='/my-trips' sx={{ gap: 2 }}>
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary={t('nav.myTrips')} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href='/offers' sx={{ gap: 2 }}>
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  <LocalOfferIcon />
                </ListItemIcon>
                <ListItemText primary={t('nav.offers')} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href='/chats' sx={{ gap: 2 }}>
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  <ChatIcon />
                </ListItemIcon>
                <ListItemText primary={t('nav.messages')} />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton component={Link} href='/add-trip' sx={{ gap: 2 }}>
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  <FlightTakeoffIcon color='primary' />
                </ListItemIcon>
                <ListItemText
                  primary={t('nav.postTrip')}
                  primaryTypographyProps={{
                    color: 'primary.main',
                    fontWeight: 600,
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href='/send-item'
                sx={{ gap: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  <LuggageIcon color='secondary' />
                </ListItemIcon>
                <ListItemText
                  primary={t('nav.sendItem')}
                  primaryTypographyProps={{
                    color: 'secondary.main',
                    fontWeight: 600,
                  }}
                />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href={`/profile/${effectiveUser.id}`}
                sx={{ gap: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary={t('nav.profile')} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleSignOut} sx={{ gap: 2 }}>
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  <LogoutIcon color='error' />
                </ListItemIcon>
                <ListItemText
                  primary={t('nav.logout')}
                  primaryTypographyProps={{ color: 'error.main' }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};
