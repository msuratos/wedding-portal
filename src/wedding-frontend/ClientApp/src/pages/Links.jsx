import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Grid, Input, Card,
  CardActions, CardContent, CardMedia
} from '@mui/material';

import WhiteButton from '../components/WhiteButton';
import PasswordPic from '../assets/link-password-pic.jpg';

const Links = (props) => {
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

    localStorage.setItem('validPassphrase', respData);
    setIsValidPassphrase(respData);
    props.setIsValidPassphrase(respData);
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
            <Card sx={{ m: '15px', mt: '45px' }}>
              <CardMedia component="img" height="250" image={PasswordPic} alt="password-pic" />
              <CardContent>
                <Input placeholder="Enter password" inputProps={{ 'aria-label': 'description' }}
                  value={passphrase} onChange={(e) => setPassphrase(e.target.value)} autoFocus fullWidth />
              </CardContent>
              <CardActions>
                <Button variant="contained" onClick={validatePassphrase} fullWidth>Submit</Button>
              </CardActions>
            </Card>
          )
          : (
            <Grid container sx={{ p: '10px', minHeight: '80vh' }} alignItems="center" justifyContent="center">
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <WhiteButton fullWidth onClick={() => navigate('/aboutus')}>About Us</WhiteButton>
                  </Grid>
                  <Grid item xs={12}>
                    <WhiteButton fullWidth onClick={() => navigate('/info')}>Wedding Details</WhiteButton>
                  </Grid>
                  <Grid item xs={12}>
                    <WhiteButton fullWidth onClick={() => navigate('/rsvp')}>RSVP</WhiteButton>
                  </Grid>
                  <Grid item xs={12}>
                    <WhiteButton fullWidth onClick={() => navigate('/registry')}>Gifts</WhiteButton>
                  </Grid>
                  <Grid item xs={12}>
                    <WhiteButton fullWidth onClick={() => navigate('/faq')}>FAQs+Contact Us</WhiteButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )
      }
    </>
  );
};

export default Links;