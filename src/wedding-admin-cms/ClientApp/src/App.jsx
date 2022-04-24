import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Layout } from './components/Layout';
import Home from './pages/Home';
import EditWedding from './pages/EditWedding';
import Song from './pages/Song';

import './custom.css'

const App = () => {
  return (
    <Layout>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/edit-wedding' component={EditWedding} />
        <Route path='/songs' component={Song} />
        <Route path="*" component={() => <div>Page not found! Try again!</div>} />
      </Switch>
    </Layout>
  );
};

export default App;