import React, { useState } from 'react';
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
        <h1>
          Melvin & Erlynn Suratos Wedding
          <h5>July 8, 2022</h5>
        </h1>
        <div className="countdown-body">
          <span className="countdown-number">{timeLeft.days}</span> <span className="countdown-label">Days</span> &nbsp;&nbsp;
          <span className="countdown-number">{timeLeft.hours}</span> <span className="countdown-label">Hrs</span> &nbsp;&nbsp;
          <span className="countdown-number">{timeLeft.minutes}</span> <span className="countdown-label">Mins</span> &nbsp;&nbsp;
          <span className="countdown-number">{timeLeft.seconds}</span> <span className="countdown-label">Secs</span><br />
          <label>Until the wedding!</label>
        </div>
      </header>
    </div>
  );
}

export default App;
