import React from 'react';

import {
  Avatar, Divider, List, ListItem, ListItemAvatar,
  ListItemText, Typography
} from '@mui/material';

import CheckroomIcon from '@mui/icons-material/Checkroom';
import PaletteIcon from '@mui/icons-material/Palette';

import { blueGrey, grey } from '@mui/material/colors';

const DressCode = (
  <List>
    <li>
      <Typography sx={{ mt: 0.5, ml: 9 }} color="text.secondary" display="block" variant="caption">
        Theme
      </Typography>
    </li>
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <PaletteIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary="Dusty Blue" secondary="Grey/Silver" />
      <Avatar sx={{ bgcolor: blueGrey[300] }}> </Avatar>
      <Avatar sx={{ bgcolor: grey['A400'] }}> </Avatar>
    </ListItem>
    <Divider variant="inset" component="li" />
    <li>
      <Typography sx={{ mt: 0.5, ml: 9 }} color="text.secondary" display="block" variant="caption">
        Dress Code
      </Typography>
    </li>
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <CheckroomIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary="Summer Semi-Formal" secondary="Dressy attire that's suitable for the summer heat & a night full of dancing. *No need for super high heels and uncomfortable dress shoes" />
    </ListItem>
  </List>
);

export default DressCode;