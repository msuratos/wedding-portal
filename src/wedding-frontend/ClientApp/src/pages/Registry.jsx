import React from 'react';
import { Grid, Typography } from '@mui/material';
import ListPageLayout from '../components/ListPageLayout';

const Registry = () => {
  return (
    <ListPageLayout>
      <Grid item xs={12}>
        <Typography variant='p' align='center' display='block' gutterBottom>
          Weddings are expensive on top of still trying to "adult" our way through life 😭 So, we would greatly appreciate any monetary donations to start saving up for a future home 🙌🏽
        </Typography>
      </Grid>
    </ListPageLayout>
  );
};

export default Registry;