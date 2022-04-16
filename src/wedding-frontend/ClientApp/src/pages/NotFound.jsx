import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Container, Grid, Paper, Toolbar, Typography } from '@mui/material';

const NotFound = () => {
  return (
    <>
      <AppBar position="static">
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
          <Grid item xs={12}>
            <Typography color="error" variant="h5">Page Not Found!</Typography>
          </Grid>
          <Grid item xs={12}>
            <p>Click <Link to="/">here</Link> to go back to the home page</p>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default NotFound;