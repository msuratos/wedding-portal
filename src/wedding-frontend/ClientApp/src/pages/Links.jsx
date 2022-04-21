import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Button, Container, Grid,
  Input, Paper, Toolbar, Typography
} from '@mui/material';
import WhiteButton from '../components/WhiteButton';
import { blueGrey } from '@mui/material/colors';

const Links = () => {
  const [isValidPassphrase, setIsValidPassphrase] = useState(false);
  const [passphrase, setPassphrase] = useState('');

  const navigate = useNavigate();

  const validatePassphrase = async () => {
    console.debug('validating passphrase');
    const resp = await fetch('api/wedding', {
      method: 'POST',
      body: JSON.stringify({ passphrase }),
      headers: { 'Content-Type': 'application/json' }
    });

    const respData = await resp.text();
    console.debug('is valid passphrase?', respData);

    setIsValidPassphrase(respData);
    localStorage.setItem('validPassphrase', respData);
  };

  useEffect(() => {
    function isExistingValidPassphrase() {
      // check local storage
      if (localStorage.getItem('validPassphrase'))
        setIsValidPassphrase(true);
    };

    isExistingValidPassphrase();
  }, []);

  return (
    <>
      {
        !isValidPassphrase
          ? (
            <>
              <AppBar position="static" sx={{ backgroundColor: blueGrey[500] }}>
                <Container maxWidth="xl">
                  <Toolbar disableGutters>
                    <Typography variant="h6" noWrap component="div" sx={{ mr: 'auto', ml: 'auto', display: { xs: 'flex', md: 'flex' } }}>
                      Melvin & Erlynn's Wedding 2.0!
                    </Typography>
                  </Toolbar>
                </Container>
              </AppBar>
              <Paper sx={{ m: '15px', mt: '45px' }}>
                <Grid container spacing={1} sx={{ p: '5px' }}>
                  <Grid item xs={12} md={6}>
                    <Input placeholder="Enter password" inputProps={{ 'aria-label': 'description' }}
                      value={passphrase} onChange={(e) => setPassphrase(e.target.value)} autoFocus fullWidth />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Button onClick={validatePassphrase} fullWidth>Submit</Button>
                  </Grid>
                </Grid>
              </Paper>
            </>
          )
          : (
            <>
              <AppBar position="static" sx={{ backgroundColor: blueGrey[500] }}>
                <Container maxWidth="xl">
                  <Toolbar disableGutters>
                    <Typography variant="h6" noWrap component="div" sx={{ mr: 'auto', ml: 'auto', display: { xs: 'flex', md: 'flex' } }}>
                      Melvin & Erlynn's Wedding 2.0!
                    </Typography>
                  </Toolbar>
                </Container>
              </AppBar>
              <Grid container sx={{ p: '10px', minHeight: '80vh' }} alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <WhiteButton fullWidth onClick={() => navigate('/info')}>Wedding Details</WhiteButton>
                    </Grid>
                    <Grid item xs={12}>
                      <WhiteButton fullWidth onClick={() => navigate('/rsvp')}>RSVP</WhiteButton>
                    </Grid>
                    <Grid item xs={12}>
                      <WhiteButton fullWidth onClick={() => navigate('/registry')}>Registry</WhiteButton>
                    </Grid>
                    <Grid item xs={12}>
                      <WhiteButton fullWidth onClick={() => navigate('/aboutus')}>About Us</WhiteButton>
                    </Grid>
                    <Grid item xs={12}>
                      <WhiteButton fullWidth onClick={() => navigate('/faq')}>FAQs</WhiteButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )
      }
    </>
  );
};

export default Links;