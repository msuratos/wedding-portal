import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert, Button, Box, Checkbox, Collapse, Grid, List, ListItemButton, ListItemIcon,
  ListItemText, ListSubheader, Paper, Skeleton, Snackbar, TextField, Typography
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const Rsvp = () => {
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mainGuests, setMainGuests] = useState(null);
  const [muiAlert, setMuiAlert] = useState({ type: 'success', message: '', open: false })
  const [nameSearchValue, setNameSearchValue] = useState('');
  const [openNested, setOpenNested] = useState([]);
  const [relatedChecked, setRelatedChecked] = useState([]);
  const [showSongRequests, setShowSongRequests] = useState(false);
  const [songRequests, setSongRequests] = useState('');

  const navigate = useNavigate();

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

  const onAlertClose = () => {
    setMuiAlert({ open: false });
  };

  const rsvpClick = async () => {
    const rsvpList = [...checked, ...relatedChecked];

    const resp = await fetch('api/guest', {
      method: 'POST',
      body: JSON.stringify(rsvpList),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (resp.ok) {
      setMuiAlert({ type: 'success', message: 'Successfully RSVP\'d!', open: true });

      setChecked([]);
      setOpenNested([]);
      setRelatedChecked([]);
      setMainGuests(null);
      setNameSearchValue('');

      // once a guest has rsvp'd, then they should be able to add song requests anytime
      setShowSongRequests(true);
      localStorage.setItem('showSongRequests', true);
    }
    else {
      setMuiAlert({ type: 'success', message: 'something went wrong reserving you & your group. please try again', open: true });
    }
  };

  const searchClick = async () => {
    setLoading(true);

    const resp = await fetch(`api/guest?nameSearchValue=${nameSearchValue}`);
    const respData = await resp.json();

    setLoading(false);
    setMainGuests(respData);
  };

  const songRequestClick = async () => {
    const resp = await fetch('/api/songrequest', {
      method: 'POST',
      body: JSON.stringify({ songNames: songRequests }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (resp.ok) {
      setMuiAlert({ message: 'successfully added your request!', open: true, type: 'success' });
      setSongRequests('');
    }
    else
      setMuiAlert({ message: 'could not add your request... try again', open: true, type: 'error' });
  };

  useEffect(() => {
    if (localStorage.getItem('showSongRequests'))
      setShowSongRequests(true);
  }, []);

  return (
    <>
      <Paper elevation={3} sx={{ m: '15px' }}>
        <Grid container spacing={1} sx={{ p: '5px' }}>
          <Grid item xs={12}>
            <Button onClick={() => navigate(-1)}><ArrowBackIcon />back</Button>
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
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
          <Grid item xs={12} sx={{ p: '5px' }}>
            <Typography variant="caption" display="block" gutterBottom>
              Just a reminder that, although we love your children, unfortunately we aren’t able to accommodate them at this time because of budget & space constraints 😢
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      {mainGuests === null
        ? (
          <>
            {!loading ? <></>
              : (
                <Paper elevation={3} sx={{ m: '15px' }}>
                  <Grid container sx={{ p: '5px' }}>
                    <Grid item xs={12}>
                      <Skeleton variant="text" />
                      <Skeleton variant="text" />
                      <Skeleton variant="text" />
                    </Grid>
                  </Grid>
                </Paper>
              )
            }
          </>
        )
        : (
          <Paper elevation={3} sx={{ m: '15px' }}>
            <Grid container sx={{ p: '5px' }}>
              <Grid item xs={12}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  {mainGuests.map(guest => (
                    <>
                      <ListItemButton key={guest.guestId} role={undefined} onClick={handleToggle(guest)} dense>
                        <ListItemIcon>
                          <AccountCircleIcon edge="start" />
                        </ListItemIcon>
                        <ListItemText id={guest.name} primary={guest.name} />
                        <ListItemIcon>
                          <Checkbox edge="end" tabIndex={-1} checked={guest.hasRsvpd || checked.indexOf(guest) !== -1}
                            disabled={guest.hasRsvpd}
                            inputProps={{ 'aria-labelledby': guest.name }}
                          />
                        </ListItemIcon>

                        {/* align empty expand icons with items that also have expandicon */}
                        {guest.relatedGuests.length === 0
                          ? <div style={{ height: '1.5em', width: '1.5em' }}></div>
                          : (
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
                                  <ListItemButton key={relatedGuest.guestId} sx={{ pl: 4 }} onClick={handleRelatedToggle(relatedGuest)}>
                                    <ListItemIcon>
                                      <AccountCircleIcon edge="start" />
                                    </ListItemIcon>
                                    <ListItemText id={relatedGuest.name} primary={relatedGuest.name} />
                                    <ListItemIcon>
                                      <Checkbox edge="end" tabIndex={-1} checked={relatedGuest.hasRsvpd || relatedChecked.indexOf(relatedGuest) !== -1}
                                        disabled={relatedGuest.hasRsvpd}
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
                <Button variant="contained" onClick={rsvpClick} fullWidth>RSVP</Button>
              </Grid>
            </Grid>
          </Paper>
        )
      }
      {showSongRequests &&
        (
          <Paper elevation={3} sx={{ m: '15px' }}>
            <Grid container spacing={1} sx={{ p: '5px' }}>
              <Grid item xs={12}>
                <TextField label="Enter your song request(s)" variant="standard" value={songRequests}
                  onChange={(e) => setSongRequests(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={searchClick} onClick={songRequestClick} fullWidth>
                  Add Song Request
                </Button>
              </Grid>
              <Grid item xs={12} sx={{ p: '5px' }}>
                <Typography variant="caption" display="block" gutterBottom>
                  To add multiple requests, add commas ',' between each request
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )
      }
      <Snackbar key='bottom-center' anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={onAlertClose}
        open={muiAlert.open}
        autoHideDuration={3000}
      >
        <Alert severity={muiAlert.type} onClose={onAlertClose}>{muiAlert.message}</Alert>
      </Snackbar>
    </>
  );
};

export default Rsvp;