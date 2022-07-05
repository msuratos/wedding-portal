import React, { useEffect, useState } from 'react';
import ListPageLayout from '../components/ListPageLayout';
import { getSchedule } from '../apis/scheduleApi';

import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

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
        <Typography variant='subtitle2'>Schedule</Typography>
        <List dense>
          {schedule.map((sched, index) => (
            <React.Fragment key={sched.scheduleId}>
              <ListItem alignItems='center' sx={{ justifyContent: 'center' }} disablePadding>
                <Typography variant='h5' gutterBottom>{sched.activity}</Typography>
              </ListItem>
              <ListItem alignItems='center' sx={{ justifyContent: 'center' }} disablePadding>
                <Typography variant='caption' gutterBottom>
                  {new Date(sched.activityStartTime).toLocaleTimeString()}
                  -
                  {new Date(sched.activityEndTime).toLocaleTimeString()}
                </Typography>
              </ListItem>
              <ListItem alignItems='center' sx={{ justifyContent: 'center', height: '3vh' }} disablePadding>
                <Divider orientation='vertical' />
              </ListItem>
              {index !== (schedule.length - 1)
                ? <></>
                : (
                  <ListItem alignItems='center' sx={{ justifyContent: 'center', textAlign: 'center' }}>
                    <Typography variant='h6'>End of the night, thanks for celebrating with us! 🙌🏽🎉🥂</Typography>
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