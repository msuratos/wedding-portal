import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMsal } from "@azure/msal-react";
import {
  AppBar, Avatar, Box, Button, Container, Drawer, IconButton, List, ListItem,
  ListItemButton, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography
} from '@mui/material';
import ChurchIcon from '@mui/icons-material/Church';
import MenuIcon from '@mui/icons-material/Menu';

import './NavMenu.css';

const pages = ['Home', 'Edit Wedding(s)'];
const settings = ['Logout'];

export const NavMenu = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const history = useHistory();

  const { accounts, instance } = useMsal();
  const { name } = accounts[0];

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (setting) => {
    switch (setting) {
      case 'Logout':
        instance.logout();
        break;
      default:
        console.error('invalid user menu setting', setting);
    }

    setAnchorElUser(null);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const onListItemButtonClick = (page) => {
    switch (page) {
      case 'Home':
        history.push('/');
        break;
      case 'Edit Wedding(s)':
        history.push('/edit-wedding');
        break;
      default:
        console.error('invalid route path', page);
    }

    handleCloseNavMenu();
  };

  return (
    <header style={{ marginBottom: '15px' }}>
      <AppBar position='static'>
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            {/* Nav Menu for smaller screens */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar"
                aria-haspopup="true" color="inherit" onClick={handleOpenNavMenu}
              >
                <MenuIcon />
              </IconButton>
              <Drawer anchor='left' open={Boolean(anchorElNav)} onClose={handleCloseNavMenu}>
                <List>
                  {pages.map(page => (
                    <ListItem key={page} disablePadding>
                      <ListItemButton onClick={() => { onListItemButtonClick(page); }}>
                        <ListItemText primary={page} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </Box>

            {/* Logo placement */}
            <ChurchIcon sx={{ display: 'flex', mr: 1 }} />
            <Typography variant='h6' component='a' onClick={() => history.push('/')} noWrap
              sx={{
                mr: 2, display: 'flex', fontFamily: 'monospace', fontWeight: 700,
                letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none'
              }}
            >
              Wedding Portal
            </Typography>

            {/* Nav Menu for bigger screens, just list of buttons for pages */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button key={page} onClick={() => { onListItemButtonClick(page); }} sx={{ my: 2, color: 'white', display: 'block' }}>
                  {page}
                </Button>
              ))}
            </Box>

            {/* User menu settings menu */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={name}>{name[0]}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu sx={{ mt: '45px' }} anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu} keepMounted
              >
                <MenuItem disabled>
                  <Typography textAlign="center">Hello, {name}!</Typography>
                </MenuItem>
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => { handleCloseUserMenu(setting); }}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </header>
  );
}
