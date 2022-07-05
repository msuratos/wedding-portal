import React, { useEffect, useState } from 'react';
import ListPageLayout from '../components/ListPageLayout';
import { getSchedule } from '../apis/scheduleApi';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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
      <Typography variant='subtitle2'>Schedule</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size='small'>
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
    </ListPageLayout>
  );
};

export default Schedule;