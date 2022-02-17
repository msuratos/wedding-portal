import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import ChurchIcon from '@mui/icons-material/Church';
import WarehouseIcon from '@mui/icons-material/Warehouse';

import './App.css';

const App = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const weddingDate = new Date('07/08/2022 13:00:00 GMT-07:00');

  const calculateTimeLeft = () => {
    const currentdate = new Date();
    const difference = +weddingDate - +currentdate;

    if (difference > 0)
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    else {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconeds: 0 });
    }

    return timeLeft;
  };

  setTimeout(() => calculateTimeLeft(), 1000);

  return (
    <div className="App">
      <header className="App-header countdown-header">
        <Typography variant="h4" gutterBottom>
          Melvin & Erlynn Suratos Wedding
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          July 8, 2022
        </Typography>
        <div className="countdown-body">
          <span className="countdown-number">{timeLeft.days}</span> <span className="countdown-label">Days</span> &nbsp;&nbsp;
          <span className="countdown-number">{timeLeft.hours}</span> <span className="countdown-label">Hrs</span> &nbsp;&nbsp;
          <span className="countdown-number">{timeLeft.minutes}</span> <span className="countdown-label">Mins</span> &nbsp;&nbsp;
          <span className="countdown-number">{timeLeft.seconds}</span> <span className="countdown-label">Secs</span><br />
          <label>Until the wedding!</label>
        </div>
      </header>
      <Grid container alignItems="center" spacing={3}>
        {/* Cermony Details */}
        <Grid item xs={6}>
          <Typography variant="subtitle2" gutterBottom>
            <ChurchIcon />Cermony Location:
          </Typography>
        </Grid>
        <Grid item xs={6}><a href="https://maps.google.com/?q=Holy%20Spirit%20Catholic%20Church">Holy Spirit Catholic Church</a></Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" gutterBottom>
            <AccessTimeIcon />Cermony Time:
          </Typography>
        </Grid>
        <Grid item xs={6}>1:00 PM</Grid>

        {/* Reception Details */}
        <Grid item xs={6}>
          <Typography variant="subtitle2" gutterBottom>
            <WarehouseIcon />Reception Location:
          </Typography>
        </Grid>
        <Grid item xs={6}><a href="https://maps.google.com/?q=Simple%20Affair">Simple Affair</a></Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" gutterBottom>
            <AccessAlarmIcon />Reception Time:
          </Typography>
        </Grid>
        <Grid item xs={6}>5:00 PM</Grid>
      </Grid>
    </div>
  );
}

export default App;
