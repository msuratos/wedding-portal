import React, { useState } from 'react';
import {
  Button, Box, Checkbox, Collapse, Grid, List, ListItemButton,
  ListItemIcon, ListItemText, ListSubheader, Paper, TextField, Typography
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const Rsvp = () => {
  const [checked, setChecked] = useState([]);
  const [openNested, setOpenNested] = useState([]);
  const [relatedChecked, setRelatedChecked] = useState([]);
  const [mainGuests, setMainGuests] = useState(null);
  const [nameSearchValue, setNameSearchValue] = useState('');

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    const newOpenNested = [...openNested];

    if (currentIndex === -1) {
      newChecked.push(value);
      newOpenNested.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
      newOpenNested.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    setOpenNested(newOpenNested);
  };

  const handleRelatedToggle = (value) => () => {
    const currentIndex = relatedChecked.indexOf(value);
    const newChecked = [...relatedChecked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setRelatedChecked(newChecked);
  };

  const searchClick = async (e) => {
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
              <TextField label="Enter Your Name" variant="standard" error={nameSearchValue.length < 4}
                helperText={nameSearchValue.length < 4 ? 'enter at least 4 characters' : null}
                value={nameSearchValue} onChange={e => setNameSearchValue(e.target.value)} fullWidth />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={searchClick} disabled={nameSearchValue.length < 4} fullWidth>Search</Button>
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
                  {mainGuests.map(guest => (
                    <>
                      <ListItemButton key={guest.guestGroupId} role={undefined} onClick={handleToggle(guest)} dense>
                        <ListItemIcon>
                          <AccountCircleIcon edge="start" />
                        </ListItemIcon>
                        <ListItemText id={guest.name} primary={guest.name} />
                        <ListItemIcon>
                          <Checkbox edge="end" tabIndex={-1} checked={checked.indexOf(guest) !== -1}
                            inputProps={{ 'aria-labelledby': guest.name }}
                          />
                        </ListItemIcon>
                        {guest.relatedGuests.length === 0 ? <div style={{ height: '1.5em', width: '1.5em' }}></div> :
                          (
                            <>
                              {openNested.indexOf(guest) !== -1 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </>
                          )
                        }
                      </ListItemButton>
                      {guest.relatedGuests.length === 0 ? <></> :
                        (
                          <Collapse in={openNested.indexOf(guest) !== -1} timeout="auto" unmountOnExit>
                            <List
                              subheader={
                                <ListSubheader component="div">
                                  RSVP others in your group?
                                </ListSubheader>
                              }
                              disablePadding
                            >
                              {
                                guest.relatedGuests.map(relatedGuest => (
                                  <ListItemButton key={relatedGuest.guestGroupId} sx={{ pl: 4 }} onClick={handleRelatedToggle(relatedGuest)}>
                                    <ListItemIcon>
                                      <AccountCircleIcon edge="start" />
                                    </ListItemIcon>
                                    <ListItemText id={relatedGuest.name} primary={relatedGuest.name} />
                                    <ListItemIcon>
                                      <Checkbox edge="end" tabIndex={-1} checked={relatedChecked.indexOf(relatedGuest) !== -1}
                                        inputProps={{ 'aria-labelledby': guest.name }}
                                      />
                                    </ListItemIcon>
                                  </ListItemButton>
                                ))
                              }
                            </List>
                          </Collapse>
                        )
                      }
                    </>
                  ))}
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