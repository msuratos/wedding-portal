import React, { useEffect, useState } from 'react';

import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import ListPageLayout from '../components/ListPageLayout';
import { getSchedule } from '../apis/scheduleApi';
import './Schedule.css';

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const init = async () => {
      const data = await getSchedule();
      setSchedule(data);
    };

    init();
  }, []);

  return (
    <ListPageLayout>
      <Grid item xs={12}>
        <Typography variant='h2' sx={{ fontFamily: 'Rastanty', textAlign: 'center' }}>Schedule</Typography>
        <Divider />
        <List dense>
          {schedule.map((sched, index) => (
            <React.Fragment key={sched.scheduleId}>
              <ListItem alignItems='center' sx={{ justifyContent: 'center' }} disablePadding>
                <Typography variant='h4' sx={{fontFamily: 'Rastanty'}} gutterBottom>{sched.activity}</Typography>
              </ListItem>
              <ListItem alignItems='center' sx={{ justifyContent: 'center' }} disablePadding>
                <Typography variant='caption' gutterBottom>
                  {new Date(sched.activityStartTime).toLocaleTimeString('en-us', { hour: 'numeric', minute: 'numeric' })}
                  -
                  {new Date(sched.activityEndTime).toLocaleTimeString('en-us', { hour: 'numeric', minute: 'numeric' })}
                </Typography>
              </ListItem>
              <ListItem alignItems='center' sx={{ justifyContent: 'center', height: '3vh' }} disablePadding>
                <Divider orientation='vertical' />
              </ListItem>
              {index !== (schedule.length - 1)
                ? <></>
                : (
                  <ListItem alignItems='center' sx={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column' }}>
                    <Typography variant='h4' sx={{ fontFamily: 'Rastanty' }}>End of the night, thanks for celebrating with us!</Typography>
                    <Typography variant='h6'>🙌🏽🎉🥂</Typography>
                  </ListItem>
                )
              }
            </React.Fragment>
          ))}
        </List>
      </Grid>
      {/*<TableContainer component={Paper}>*/}
      {/*  <Table sx={{ minWidth: 650 }} size='small'>*/}
      {/*    <TableHead>*/}
      {/*      <TableRow>*/}
      {/*        <TableCell>Activity</TableCell>*/}
      {/*        <TableCell align="right">Start Time</TableCell>*/}
      {/*        <TableCell align="right">End Time</TableCell>*/}
      {/*      </TableRow>*/}
      {/*    </TableHead>*/}
      {/*    <TableBody>*/}
      {/*      {schedule.map(sched => (*/}
      {/*        <TableRow key={sched.activity}>*/}
      {/*          <TableCell>{sched.activity}</TableCell>*/}
      {/*          <TableCell align="right">{new Date(sched.activityStartTime).toLocaleString('en-US')}</TableCell>*/}
      {/*          <TableCell align="right">{new Date(sched.activityEndTime).toLocaleString('en-US')}</TableCell>*/}
      {/*        </TableRow>*/}
      {/*      ))}*/}
      {/*    </TableBody>*/}
      {/*  </Table>*/}
      {/*</TableContainer>*/}
    </ListPageLayout>
  );
};

export default Schedule;