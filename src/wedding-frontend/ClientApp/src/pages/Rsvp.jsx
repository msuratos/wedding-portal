import React, { useContext, useEffect, useReducer, useState } from 'react';

import {
  Button, Box, Checkbox, Collapse, Grid, List, ListItemButton, ListItemIcon,
  ListItemText, ListSubheader, Paper, Skeleton, TextField, Typography
} from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import ListPageLayout from '../components/ListPageLayout';
import SongRequests from '../components/Rsvp/SongRequests';
import { AlertContext } from '../App';
import { rsvpGuest, searchGuest } from '../apis/guestApi';

function reducer(state, action) {
  switch (action.type) {
    case 'guestsearch/inprogress':
      return { ...state, loading: true };
    case 'guestsearch/successful':
      return { ...state, loading: false, mainGuests: action.payload };
    case 'rsvp/successful':
      return { ...state, checked: [], loading: false, mainGuests: null, relatedChecked: [], showSongRequests: true };
    case 'songrequest':
      return { ...state, showSongRequests: action.payload };
    case 'toggle':
      // return whatever the payload is. It should be either { checked: [] } or { relatedChecked: [] }
      return { ...state, ...action.payload };
    default:
      throw new Error('invalid action for reducer');
  }
}

const Rsvp = () => {
  const [nameSearchValue, setNameSearchValue] = useState('');

  const initialState = { checked: [], loading: false, mainGuests: null, relatedChecked: [], showSongRequests: false };
  const [state, dispatch] = useReducer(reducer, initialState);

  const alertContext = useContext(AlertContext);

  const handleToggle = (value, guestType) => () => {
    let currentIndex = -1;
    let checkedGuestsList = [];

    // populate the variables above with respective guest array (main guests or related guests to main guest)
    switch (guestType) {
      case 'main':
        currentIndex = state.checked.indexOf(value);
        checkedGuestsList = [...state.checked];
        break;
      case 'related':
        currentIndex = state.relatedChecked.indexOf(value);
        checkedGuestsList = [...state.relatedChecked];
        break;
      default:
        throw new Error('toggling guest checkbox failed, incorrect guest list type', guestType);
    }

    // add or remove newly checked/toggled guests to respective guest array (main guests or related guests to main guest)
    if (currentIndex === -1)
      checkedGuestsList.push(value)
    else
      checkedGuestsList.splice(currentIndex, 1);

    // save state (useReducer)
    if (guestType === 'main')
      dispatch({ type: 'toggle', payload: { checked: checkedGuestsList } });
    else if (guestType === 'related')
      dispatch({ type: 'toggle', payload: { relatedChecked: checkedGuestsList } });
  };

  const rsvpClick = async (hasRejected) => {
    const rsvpList = [...state.checked, ...state.relatedChecked];
    rsvpList.forEach(el => { el.hasRejected = hasRejected; });

    try {
      await rsvpGuest(rsvpList);

      const message = hasRejected ? 'Successfully rejected RSVP 😢' : 'Successfully RSVP\'d!';
      alertContext.setOptions({ type: 'success', message: message, open: true });

      // reset state values
      dispatch({ type: 'rsvp/successful' });
      setNameSearchValue('');

      // once a guest has rsvp'd, then they should be able to add song requests anytime
      localStorage.setItem('showSongRequests', true);
    }
    catch (error) {
      console.error(error);
      alertContext.setOptions({ type: 'error', message: 'something went wrong reserving you & your group. please try again', open: true });
    }
  };

  const searchClick = async () => {
    dispatch({ type: 'guestsearch/inprogress' });
    const guests = await searchGuest(nameSearchValue);
    dispatch({ type: 'guestsearch/successful', payload: guests });
  };

  useEffect(() => {
    if (localStorage.getItem('showSongRequests'))
      dispatch({ type: 'songrequest', payload: true })
  }, []);

  return (
    <>
      <ListPageLayout hasTitle title='RSVP'>
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
      </ListPageLayout>
      {state.mainGuests === null
        ? (
          <>
            {!state.loading ? <></>
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
            <Grid container spacing={1} sx={{ p: '5px' }}>
              <Grid item xs={12}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  {state.mainGuests.map(guest => (
                    <>
                      <ListItemButton key={guest.guestId} role={undefined} onClick={handleToggle(guest, 'main')} dense>
                        <ListItemIcon>
                          <AccountCircleIcon edge="start" />
                        </ListItemIcon>
                        <ListItemText id={guest.name} primary={guest.name} />
                        <ListItemIcon>
                          <Checkbox edge="end" tabIndex={-1} checked={guest.hasRsvpd || state.checked.indexOf(guest) !== -1}
                            disabled={guest.hasRsvpd}
                            inputProps={{ 'aria-labelledby': guest.name }}
                          />
                        </ListItemIcon>

                        {/* align empty expand icons with items that also have expandicon */}
                        {guest.relatedGuests.length === 0
                          ? <div style={{ height: '1.5em', width: '1.5em' }}></div>
                          : (
                            <>
                              {state.checked.indexOf(guest) !== -1 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </>
                          )
                        }
                      </ListItemButton>
                      {guest.relatedGuests.length === 0 ? <></> :
                        (
                          <Collapse key={`${guest.guestId}-collapse`} in={state.checked.indexOf(guest) !== -1} timeout="auto" unmountOnExit>
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
                                  <ListItemButton key={relatedGuest.guestId} sx={{ pl: 4 }} onClick={handleToggle(relatedGuest, 'related')}>
                                    <ListItemIcon>
                                      <AccountCircleIcon edge="start" />
                                    </ListItemIcon>
                                    <ListItemText id={relatedGuest.name} primary={relatedGuest.name} />
                                    <ListItemIcon>
                                      <Checkbox edge="end" tabIndex={-1} checked={relatedGuest.hasRsvpd || state.relatedChecked.indexOf(relatedGuest) !== -1}
                                        disabled={relatedGuest.hasRsvpd}
                                        inputProps={{ 'aria-labelledby': relatedGuest.name }}
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
                <Button variant="contained" onClick={(e) => rsvpClick(false)} fullWidth>RSVP</Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" sx={{ backgroundColor: '#909090' }} onClick={(e) => rsvpClick(true)} fullWidth>Can't Go 😢</Button>
              </Grid>
            </Grid>
          </Paper>
        )
      }
      {state.showSongRequests && <SongRequests />}
    </>
  );
};

export default Rsvp;