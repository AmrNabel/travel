'use client';

import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang: 'en' | 'ar-EG') => {
    changeLanguage(lang);
    handleClose();
  };

  return (
    <>
      <Tooltip title='Change Language'>
        <IconButton
          onClick={handleClick}
          size='small'
          sx={{ ml: 1 }}
          aria-controls={open ? 'language-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          <LanguageIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id='language-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => handleLanguageChange('en')}
          selected={language === 'en'}
        >
          <ListItemIcon>
            {language === 'en' && <CheckIcon fontSize='small' />}
          </ListItemIcon>
          <ListItemText>English</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleLanguageChange('ar-EG')}
          selected={language === 'ar-EG'}
        >
          <ListItemIcon>
            {language === 'ar-EG' && <CheckIcon fontSize='small' />}
          </ListItemIcon>
          <ListItemText>العربية (مصر)</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

