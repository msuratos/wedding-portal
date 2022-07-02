import React, { useContext, useState } from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { AlertContext } from '../../App';
import { addSongRequest } from '../../apis/songRequestApi';

const SongRequests = () => {
  const [songRequests, setSongRequests] = useState('');
  const alertContext = useContext(AlertContext);

  const songRequestClick = async () => {
    const areSongsAddedSuccessfully = await addSongRequest(songRequests);

    if (areSongsAddedSuccessfully) {
      alertContext.setOptions({ message: 'successfully added your request!', open: true, type: 'success' });
      setSongRequests('');
    }
    else
      alertContext.setOptions({ message: 'could not add your request... try again', open: true, type: 'error' });
  };

  return (
    <Paper elevation={3} sx={{ m: '15px' }}>
      <Grid container spacing={1} sx={{ p: '5px' }}>
        <Grid item xs={12}>
          <TextField label="Enter your song request(s)" variant="standard" value={songRequests}
            helperText="To add multiple requests, add commas ',' between each request; include artist"
            onChange={(e) => setSongRequests(e.target.value)} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={songRequestClick} fullWidth>
            Add Song Request
          </Button>
        </Grid>
        <Grid item xs={12} sx={{ p: '5px' }}>
          <Typography variant="caption" display="block" gutterBottom>
            These song requests will help us decide what to play during the wedding
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SongRequests;