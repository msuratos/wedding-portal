import React from 'react';

import {
  Avatar, Button, Divider, List, ListItem, ListItemAvatar,
  ListItemButton, ListItemText, Typography
} from '@mui/material';

import ChurchIcon from '@mui/icons-material/Church';
import LiquorIcon from '@mui/icons-material/Liquor';

import WeddingCalendar from '../../assets/merlynn-wedding.ics';

const CeremonyReceptionDetails = (
  <>
    <List>
      <li>
        <Typography sx={{ mt: 0.5, ml: 9 }} color="text.secondary" display="block" variant="caption">
          Ceremony
        </Typography>
      </li>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <ChurchIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemButton sx={{ p: 0 }} onClick={() => window.open('https://www.google.com/maps/place/Holy+Spirit+Catholic+Church/@36.0827588,-115.3218066,17z/data=!4m13!1m7!3m6!1s0x80c8b8e58142f751:0x8e72ed06a4ea0cd8!2s5830+Mesa+Park+Dr,+Las+Vegas,+NV+89135!3b1!8m2!3d36.0827588!4d-115.3196179!3m4!1s0x80c8b8e5837699c7:0xc60650b4c6b9ddc7!8m2!3d36.0828216!4d-115.3195697')}>
          <ListItemText primary="Holy Spirit Catholic Church" secondary="July 8, 2022 @ 2:30 PM" />
        </ListItemButton>
      </ListItem>
      <Divider variant="inset" component="li" />
      <li>
        <Typography sx={{ mt: 0.5, ml: 9 }} color="text.secondary" display="block" variant="caption">
          Reception
        </Typography>
      </li>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <LiquorIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemButton sx={{ p: 0 }} onClick={() => window.open('https://www.google.com/maps/place/A+Simple+Affair+Events/@36.15752,-115.3157431,17z/data=!3m1!4b1!4m5!3m4!1s0x80c8bfa40088b0ab:0x41d901a02df96fb7!8m2!3d36.1575157!4d-115.3135544')}>
          <ListItemText primary="A Simple Affair" secondary="July 8, 2022 @ 6:00 PM" />
        </ListItemButton>
      </ListItem>
    </List>
    <Button href={WeddingCalendar}>Add To Calendar</Button>
  </>
);

export default CeremonyReceptionDetails;