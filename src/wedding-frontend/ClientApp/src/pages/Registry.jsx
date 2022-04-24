import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Paper, Typography } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Registry = () => {
  const navigate = useNavigate();

  return (
    <Paper elevation={3} sx={{ m: '15px' }}>
      <Grid container sx={{ p: '5px' }}>
        <Grid item xs={12}>
          <Button onClick={() => navigate(-1)}><ArrowBackIcon />back to links</Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='p' align='center' display='block' gutterBottom>
            Weddings are expensive on top of still trying to "adult" our way through life 😭 So, we would greatly appreciate any monetary donations so start saving up for a future home 🙌🏽
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Registry;