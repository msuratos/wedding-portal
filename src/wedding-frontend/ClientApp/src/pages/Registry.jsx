import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Paper, Typography } from '@mui/material';

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyIcon from '@mui/icons-material/Money';

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
            Honestly, just monetary gifts is the best 😊
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button variant='contained' fullWidth><AttachMoneyIcon />Zelle</Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' fullWidth><MoneyIcon />Cash</Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' fullWidth><AccountBalanceIcon />Check</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Registry;