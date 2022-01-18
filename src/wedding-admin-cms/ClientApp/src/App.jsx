import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import FetchData from './pages/FetchData';
import Counter from './pages/Counter';

import './custom.css'

const App = () => {
  return (
    <Layout>
      <Route exact path='/' component={Home} />
      <Route path='/counter' component={Counter} />
      <Route path='/fetch-data' component={FetchData} />
    </Layout>
  );
};

export default App;