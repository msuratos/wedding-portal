import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Paper, Typography } from '@mui/material';

const NotFound = () => {
  return (
    <Paper sx={{ m: '15px', mt: '45px' }}>
      <Grid container spacing={1} sx={{ p: '5px' }}>
        <Grid item xs={12}>
          <Typography color="error" variant="h5">Page Not Found!</Typography>
        </Grid>
        <Grid item xs={12}>
          <p>Click <Link to="/">here</Link> to go back to the home page</p>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default NotFound;