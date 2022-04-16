import React, { useState } from 'react';
import {
  Button, Box, Checkbox, Grid, IconButton, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Paper, TextField, Typography
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const Rsvp = () => {
  const [checked, setChecked] = React.useState([0]);
  const [mainGuests, setMainGuests] = useState(null);
  const [nameSearchValue, setNameSearchValue] = useState('');

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const searchClick = async (e) => {
    // TODO: make sure at least 4 characters are inputted before actually searching
    const resp = await fetch(`api/guest?nameSearchValue=${nameSearchValue}`);
    const respData = await resp.json();
    setMainGuests(respData);
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
      {mainGuests === null
        ? <></>
        : (
          <Paper elevation={3} sx={{ m: '15px' }}>
            <Grid container sx={{ p: '5px' }}>
              <Grid item xs={12}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  {mainGuests.map((value, index) => {
                    const labelId = `checkbox-list-label-${value-index}`;

                    return (
                      <ListItem key={index} disablePadding>
                        <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                          <ListItemIcon>
                            <AccountCircleIcon edge="start" />
                          </ListItemIcon>
                          <ListItemText id={labelId} primary={value} />
                          <ListItemIcon>
                            <Checkbox edge="end" tabIndex={-1} checked={checked.indexOf(value) !== -1}
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </ListItemIcon>
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" fullWidth>RSVP</Button>
              </Grid>
            </Grid>
          </Paper>
        )
      }
    </>
  );
};

export default Rsvp;