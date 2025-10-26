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
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LuggageIcon from '@mui/icons-material/Luggage';
import DashboardIcon from '@mui/icons-material/Dashboard';

export const NavBar = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );

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

  if (!user) {
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
                CarryOn
              </Typography>
            </Box>
          </Link>
          {isMobile ? (
            <IconButton
              onClick={() => setMobileMenuOpen(true)}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href='/login' passHref legacyBehavior>
                <Button
                  variant='outlined'
                  sx={{
                    borderRadius: '9999px',
                    px: 3,
                  }}
                >
                  Login
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
                  Sign Up
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
          <List sx={{ width: 250, pt: 3 }}>
            <ListItem>
              <Link
                href='/login'
                style={{ width: '100%', textDecoration: 'none' }}
              >
                <Button
                  variant='outlined'
                  fullWidth
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Button>
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href='/signup'
                style={{ width: '100%', textDecoration: 'none' }}
              >
                <Button
                  variant='gradient'
                  fullWidth
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Button>
              </Link>
            </ListItem>
          </List>
        </Drawer>
      </AppBar>
    );
  }

  // Authenticated navbar
  return (
    <>
      <AppBar position='sticky' elevation={0}>
        <Toolbar sx={{ py: 1 }}>
          <Link
            href='/'
            style={{ textDecoration: 'none', flexGrow: isMobile ? 1 : 0 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FlightTakeoffIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography
                variant='h6'
                sx={{ fontWeight: 700, color: 'text.primary' }}
              >
                CarryOn
              </Typography>
            </Box>
          </Link>

          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                ml: 4,
                flexGrow: 1,
              }}
            >
              <Link href='/search' passHref legacyBehavior>
                <Button
                  color='inherit'
                  startIcon={<SearchIcon />}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  Search
                </Button>
              </Link>
              <Link href='/my-trips' passHref legacyBehavior>
                <Button
                  color='inherit'
                  startIcon={<DashboardIcon />}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  My Trips
                </Button>
              </Link>
              <Link href='/chats' passHref legacyBehavior>
                <Button
                  color='inherit'
                  startIcon={
                    <Badge badgeContent={0} color='error'>
                      <ChatIcon />
                    </Badge>
                  }
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  Messages
                </Button>
              </Link>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              ml: isMobile ? 0 : 'auto',
            }}
          >
            {isMobile ? (
              <>
                <IconButton
                  color='inherit'
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <MenuIcon />
                </IconButton>
              </>
            ) : (
              <>
                <Link href='/add-trip' passHref legacyBehavior>
                  <Button
                    variant='gradient'
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: '9999px' }}
                  >
                    Post Trip
                  </Button>
                </Link>
                <Link href='/send-item' passHref legacyBehavior>
                  <Button
                    variant='orange'
                    startIcon={<LuggageIcon />}
                    sx={{ borderRadius: '9999px' }}
                  >
                    Send Item
                  </Button>
                </Link>
              </>
            )}
            <Avatar
              sx={{
                width: 40,
                height: 40,
                cursor: 'pointer',
                border: 2,
                borderColor: 'primary.main',
              }}
              onClick={handleUserMenuOpen}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor='right'
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <List sx={{ width: 280, pt: 3 }}>
          <ListItem>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant='subtitle2' color='text.secondary'>
                Menu
              </Typography>
            </Box>
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href='/search'
              onClick={() => setMobileMenuOpen(false)}
            >
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary='Search' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href='/my-trips'
              onClick={() => setMobileMenuOpen(false)}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary='My Trips' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href='/chats'
              onClick={() => setMobileMenuOpen(false)}
            >
              <ListItemIcon>
                <Badge badgeContent={0} color='error'>
                  <ChatIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText primary='Messages' />
            </ListItemButton>
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href='/add-trip'
              onClick={() => setMobileMenuOpen(false)}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary='Post a Trip' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href='/send-item'
              onClick={() => setMobileMenuOpen(false)}
            >
              <ListItemIcon>
                <LuggageIcon />
              </ListItemIcon>
              <ListItemText primary='Send an Item' />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant='subtitle1' fontWeight={600}>
            {user.name}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {user.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem
          onClick={() => {
            router.push(`/profile/${user.id}`);
            handleUserMenuClose();
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize='small' />
          </ListItemIcon>
          My Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.push('/my-trips');
            handleUserMenuClose();
          }}
        >
          <ListItemIcon>
            <DashboardIcon fontSize='small' />
          </ListItemIcon>
          My Trips & Requests
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <LogoutIcon fontSize='small' />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
};
