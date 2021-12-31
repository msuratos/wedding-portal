import React, { useEffect, useState } from 'react';
import logo from '../logo.svg';
import './App.css';

const App = () => {
  const [data, setData] = useState('');

  useEffect(() => {
    const callApi = async () => {
      const resp = await fetch('home');
      const text = await resp.text();

      setData(text);
    };

    callApi();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {data}
      </header>
    </div>
  );
}

export default App;
