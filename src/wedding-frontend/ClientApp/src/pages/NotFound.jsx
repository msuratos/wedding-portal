import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return <div>Page not found. Click <Link to="/">here</Link> to go back to the home page</div>;
};

export default NotFound;