import React, { useState } from 'react';
import {
  Button, Box, Grid, Paper, TextField, Typography
} from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const Rsvp = () => {
  const [mainGuest, setMainGuest] = useState(null);
  const [nameSearchValue, setNameSearchValue] = useState('');

  const searchClick = (e) => {
    console.log('searching guest list with name:', nameSearchValue);
    setMainGuest(nameSearchValue);
  };

  return (
    <>
      <Paper elevation={3} sx={{ m: '15px' }}>
        <Grid container spacing={2} sx={{ p: '5px' }}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom component="div" sx={{ textAlign: 'center' }}>
              RSVP
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <GroupAddIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField label="Enter Your Name" variant="standard" value={nameSearchValue} onChange={e => setNameSearchValue(e.target.value)} fullWidth />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={searchClick} fullWidth>Search</Button>
          </Grid>
        </Grid>
      </Paper>
      {mainGuest === null
        ? <></>
        : (
          <Paper elevation={3} sx={{ m: '15px' }}>
            <Grid container sx={{ p: '5px' }}>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>{mainGuest}</Grid>
            </Grid>
          </Paper>
        )
      }
    </>
  );
};

export default Rsvp;