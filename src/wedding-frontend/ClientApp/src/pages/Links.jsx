import React, { useEffect, useState } from 'react';
import { Button, Grid, Input } from '@mui/material';

const Links = () => {
  const [isValidPassphrase, setIsValidPassphrase] = useState(false);
  const [passphrase, setPassphrase] = useState('');

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
  };

  useEffect(() => {
    function isExistingValidPassphrase () {
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
            <Grid container sx={{p: '15px'}}>
              <Grid item xs={12} md={6}>
                <Input placeholder="Passphrase" inputProps={{ 'aria-label': 'description' }}
                  value={passphrase} onChange={(e) => setPassphrase(e.target.value) } autoFocus />
              </Grid>
              <Grid item xs={12} md={12} sx={{textAlign: 'center'}}>
                <Button variant="contained" color="primary" onClick={validatePassphrase}>Submit</Button>
              </Grid>
            </Grid>
          )
          : (
            <div>
              <ul>
                <li><a href="info">Info</a></li>
                <li><a href="rsvp">RSVP</a></li>
                <li><a href="faq">FAQs</a></li>
                <li><a href="contact">Contact Us</a></li>
              </ul>
            </div>
          )
      }
    </>
  );
};

export default Links;