import React from 'react';
import { Divider, List, ListItem, ListItemText, Paper } from '@mui/material';

const Info = () => {
  return (
    <Paper sx={{ m: '15px' }}>
      <List sx={{ p: '5px' }}>
        <ListItem>
          <ListItemText>Ceremony</ListItemText>
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <ListItemText>Reception</ListItemText>
        </ListItem>

      </List>
    </Paper>
  );
};

export default Info;