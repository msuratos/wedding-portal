import React, { useEffect, useState } from 'react';
import { Button, Grid } from '@mui/material';

const Links = () => {
  const [isValidPassphrase, setIsValidPassphrase] = useState(false);

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
              <Grid item xs={12} md={6} sx={{textAlign: 'center'}}>
                <label htmlFor="passphrase">Passphrase</label>
              </Grid>
              <Grid item xs={12} md={6}>
                <input type="text" id="passphrase" title="passphrase" style={{ width: '100%' }} />
              </Grid>
              <Grid item xs={12} md={12} sx={{textAlign: 'center'}}>
                <Button variant="contained" color="primary">Submit</Button>
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