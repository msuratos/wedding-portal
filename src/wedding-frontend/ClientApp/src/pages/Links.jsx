import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Grid, Input, Card,
  CardActions, CardContent, CardMedia
} from '@mui/material';

import { AlertContext, ValidPassphraseContext } from '../App';
import { validatePassphrase } from '../apis/weddingApi';
import WhiteButton from '../components/WhiteButton';
import PasswordPic from '../assets/link-password-pic.jpg';

const Links = () => {
  const alertContext = useContext(AlertContext);
  const { isValidPassphrase, setIsValidPassphrase } = useContext(ValidPassphraseContext);
  const [passphrase, setPassphrase] = useState('');

  const navigate = useNavigate();

  const validatePassphraseClick = async () => {
    try {
      const isValidPassphrase = await validatePassphrase(passphrase);
      localStorage.setItem('validPassphrase', isValidPassphrase);
      setIsValidPassphrase(isValidPassphrase);

      if (isValidPassphrase)
        alertContext.setOptions({ type: 'success', message: 'Valid Passphrase!', open: true });
      else
        alertContext.setOptions({ type: 'error', message: 'Invalid Passphrase', open: true });
    }
    catch (error) {
      console.error(error);
      alertContext.setOptions({ type: 'error', message: error, open: true });
    }
  };

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
                <Button variant="contained" onClick={validatePassphraseClick} fullWidth>Submit</Button>
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
                    <WhiteButton fullWidth onClick={() => navigate('/menu')}>Menu</WhiteButton>
                  </Grid>
                  <Grid item xs={12}>
                    <WhiteButton fullWidth onClick={() => navigate('/schedule')}>Schedule</WhiteButton>
                  </Grid>
                  {/* TODO: only show before latest rsvp date. */}
                  {/*<Grid item xs={12}>*/}
                  {/*  <WhiteButton fullWidth onClick={() => navigate('/rsvp')}>RSVP</WhiteButton>*/}
                  {/*</Grid>*/}
                  <Grid item xs={12}>
                    <WhiteButton fullWidth onClick={() => navigate('/registry')}>Gifts</WhiteButton>
                  </Grid>
                  <Grid item xs={12}>
                    <WhiteButton fullWidth onClick={() => navigate('/faq')}>FAQs + Contact Info</WhiteButton>
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