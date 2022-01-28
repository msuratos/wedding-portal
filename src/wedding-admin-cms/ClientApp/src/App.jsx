import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import EditWedding from './pages/EditWedding';

import './custom.css'

const App = () => {
  return (
    <Layout>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/edit-wedding' component={EditWedding} />
        <Route path="*" component={() => <div>Page not found! Try again!</div>} />
      </Switch>
    </Layout>
  );
};

export default App;