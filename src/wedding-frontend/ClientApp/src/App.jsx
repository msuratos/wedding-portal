import React, { useState } from 'react';
import { Grid } from '@mui/material';

import weddingPic from './assets/wedding.jpeg';
import './App.css';
import Typography from '@mui/material/Typography';

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
      <Grid container spacing={2} style={{
        background: `url(${weddingPic}) no-repeat 50% top transparent`,
        backgroundSize: 'cover', height: window.innerWidth > 500 ? '50vh' : '40vh'
      }}>
      </Grid>
      <div className="detail-container">
        <div className="detail-header">
          <Grid container>
            <Grid item xs={12} md={12}>
              <h3 className="message">Wedding 2.0</h3>
            </Grid>
            <Grid item xs={12} md={12}>
              <h2 className="persons">MELVIN & ERLYNN</h2>
              <Typography variant="h3" sx={{ color: 'white', fontFamily: '\'Dancing Script\', cursive', textAlign: 'center' }} gutterButton>
                Suratos
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} sx={{textAlign: 'center', justifyContent: 'center'}}>
              <p className="theme-ribbon-date">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50.9px" height="35.4px" viewBox="0 0 50.9 35.4" enableBackground="new 0 0 50.9 35.4">
                  <polygon className="theme-header-ribbon-arrow" points="0,35.4 2.9,35.4 15.6,18.9 21.2,18.9 8.6,35.4 11.6,35.4 24.2,18.9 29.8,18.9 17.2,35.4 20.2,35.4 32.8,18.9 38.5,18.9 25.8,35.4 28.8,35.4 41.4,18.9 47.1,18.9 34.4,35.4 37.4,35.4 50.9,17.7 37.4,0 34.4,0 47.1,16.5 41.4,16.5 28.8,0 25.8,0 38.5,16.5 32.8,16.5 20.2,0 17.2,0 29.8,16.5 24.2,16.5 11.6,0 8.6,0 21.2,16.5 15.6,16.5 2.9,0 0,0 13.5,17.7 "></polygon>
                </svg>
                <span>July 8, 2022</span>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50.9px" height="35.4px" viewBox="0 0 50.9 35.4" enableBackground="new 0 0 50.9 35.4">
                  <polygon className="theme-header-ribbon-arrow" points="50.9,0 48,0 35.3,16.5 29.7,16.5 42.3,0 39.4,0 26.7,16.5 21.1,16.5 33.7,0 30.7,0 18.1,16.5 12.5,16.5 25.1,0 22.1,0 9.5,16.5 3.8,16.5 16.5,0 13.5,0 0,17.7 13.5,35.4 16.5,35.4 3.8,18.9 9.5,18.9 22.1,35.4 25.1,35.4 12.5,18.9 18.1,18.9 30.7,35.4 33.7,35.4 21.1,18.9 26.7,18.9 39.4,35.4 42.3,35.4 29.7,18.9 35.3,18.9 48,35.4 50.9,35.4 37.4,17.7 "></polygon>
                </svg>
              </p>
            </Grid>
          </Grid>
        </div>
      </div>
      <Grid container>
        <Grid item xs={12} md={12}>
          <div className="countdown-body">
            <span className="countdown-number">
              {timeLeft.days}
              <span className="countdown-label">Days</span>
            </span>

            &nbsp;&nbsp;

            <span className="countdown-number">
              {timeLeft.hours}
              <span className="countdown-label">Hrs</span>
            </span>

            &nbsp;&nbsp;

            <span className="countdown-number">
              {timeLeft.minutes}
              <span className="countdown-label">Mins</span>
            </span>

            &nbsp;&nbsp;

            <span className="countdown-number">
              {timeLeft.seconds}
              <span className="countdown-label">Secs</span>
            </span>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{pl: 5, pr: 5}}>
        <Grid item xs={12} md={12}>
          <p>Hi family & friends!,</p>
          <p>
            We can't wait to celebrate our wedding 2.0 with you guys! Please save our date FRIDAY, July 8, 2022, for our Catholic church wedding & reception to follow.
            Our website is currently under construction, so please check back with this QR code for the website, as well as future updates & more information.
            We will send the official invites ASAP. Thanks & can't wait to see y'all!
          </p>
          <p>With love,</p>
          <p>Melvin & Erlynn 😊</p>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
