import React, { useEffect, useMemo, useState } from 'react';
import { useMsal } from '@azure/msal-react';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { addActivity, getSchedule } from '../../apis/scheduleApi';

const ScheduleForm = (props) => {
  const { weddingId, setErrorShowAlert, setSuccessShowAlert } = props;

  // state variables to be used when getting the schedule
  const [schedule, setSchedule] = useState([]);

  // state variables to be used when adding a schedule
  // ** the start and end time variables have to follow a specific format for datetime-local input type
  // ** the format should be in yyyy-MM-ddThh:mm:ss:SSS, no 'Z' at the end
  // ** toISOString() method causes the date value to convert to correct format, but with UTC time; need to
  // **   calculate to offset it again. HOWEVER, this is hardcoded to use -07:00 timezone
  // TODO: change datetime-local format logic to use different timezones
  const [activity, setActivity] = useState('');
  const [activityStartTime, setActivityStartTime] = useState(new Date(+(new Date().setSeconds(0, 0)) - (7000 * 60 * 60)).toISOString().substr(0, 23));
  const [activityEndTime, setActivityEndTime] = useState(new Date(+(new Date().setSeconds(0, 0)) - (7000 * 60 * 60)).toISOString().substr(0, 23));

  // MSAL, Azure B2C SSO, logic
  const msal = useMsal();
  const { instance, accounts } = msal;

  const silentRequest = useMemo(() => {
    return {
      scopes: [`${process.env.REACT_APP_B2C_URL}/${process.env.REACT_APP_B2C_SCOPES}`],
      account: accounts[0]
    }
  }, [accounts]);

  // add activity button click event handler
  const addActivityButtonClick = async () => {
    if (!activity || !activityStartTime || !activityEndTime) {
      setErrorShowAlert(true); setTimeout(() => setErrorShowAlert(false), 3000);
      console.error('activity fields are empty.');

      // TODO: show error in TextFields by passing values to 'error' and 'helperText' props

      return;
    }

    const tokenCache = await instance.acquireTokenSilent(silentRequest);
    const resp = await addActivity({ activity, activityStartTime, activityEndTime, weddingId }, tokenCache.accessToken);

    if (resp.ok) {
      setSuccessShowAlert(true); setTimeout(() => setSuccessShowAlert(false), 3000);

      // reset state variables for adding food item
      setActivity('');
      setActivityStartTime(new Date(new Date().setSeconds(0, 0)));
      setActivityEndTime(new Date(new Date().setSeconds(0, 0)));
    }
    else {
      setErrorShowAlert(true); setTimeout(() => setErrorShowAlert(false), 3000);
    }
  };

  useEffect(() => {
    const init = async () => {
      const tokenCache = await instance.acquireTokenSilent(silentRequest);
      const resp = await getSchedule(weddingId, tokenCache.accessToken);

      setSchedule(resp);
    };

    init();
  }, [instance, silentRequest, weddingId]);

  return (
    <>
      {/* Section to add food item */}
      <Typography variant='subtitle2'>Add Activity to Schedule</Typography>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField id="activity-name" label="Activity" variant="outlined" value={activity} onChange={e => setActivity(e.target.value)} fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField id="activity-start-time" label="Start Time" variant="outlined" value={activityStartTime}
            type='datetime-local' onChange={e => setActivityStartTime(e.target.value)} fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField id="activity-end-time" label="End Time" variant="outlined" value={activityEndTime}
            type='datetime-local' onChange={e => setActivityEndTime(e.target.value)} fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={addActivityButtonClick} variant="contained">Add Activity</Button>
        </Grid>
      </Grid>

      <Divider sx={{ mb: '15px', mt: '15px' }} />

      {/* Section to list all the food items for the selcted wedding */}
      <Typography variant='subtitle2'>Schedule</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Activity</TableCell>
              <TableCell align="right">Start Time</TableCell>
              <TableCell align="right">End Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedule.map(sched => (
              <TableRow key={sched.activity}>
                <TableCell>{sched.activity}</TableCell>
                <TableCell align="right">{new Date(sched.activityStartTime).toLocaleString('en-US')}</TableCell>
                <TableCell align="right">{new Date(sched.activityEndTime).toLocaleString('en-US')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ScheduleForm;