import React from 'react';
import { Card, Container } from '@mui/material';
import { NavMenu } from './NavMenu';

export const Layout = (props) => {
  return (
    <div>
      <NavMenu />
      <Container maxWidth='xl'>
        <Card elevation={3} sx={{ p: '15px' }}>
          {props.children}
        </Card>
      </Container>
    </div>
  );
}
