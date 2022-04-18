import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar, Box, Button, Divider, Grid, List, ListItem, ListItemAvatar,
  ListItemButton, ListItemText, MobileStepper, Paper, Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import ChurchIcon from '@mui/icons-material/Church';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LiquorIcon from '@mui/icons-material/Liquor';
import PaletteIcon from '@mui/icons-material/Palette';

import ParkingPicture from '../assets/parking.png';

const Info = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const ceremonyReceptionDetails = (
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
  );

  const dressCode = (
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
        <ListItemText primary="Semi-formal/Summer Dress" secondary="*Ladies please come in with shoes that are comfortable, flats/low heels" />
      </ListItem>
    </List>
  );

  const parking = (
    <div>
      <img src={ParkingPicture} alt="parking-pic" title="parking-pic" width={window.innerWidth - 100} style={{ objectFit: 'cover' }} />
    </div>
  );

  const steps = [
    {
      'label': 'Ceremony & Reception',
      'component': ceremonyReceptionDetails
    },
    {
      'label': 'Dress Code',
      'component': dressCode
    },
    {
      'label': 'Parking',
      'component': parking
    }
  ];

  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Paper elevation={3} sx={{ m: '15px' }}>
      <Grid container sx={{ p: '5px' }}>
        <Grid item xs={12}>
          <Button onClick={() => navigate(-1)}><ArrowBackIcon />back to links</Button>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ flexGrow: 1 }}>
            <Paper square elevation={0} sx={{ display: 'flex', alignItems: 'center', height: 50, pl: 2, bgcolor: 'background.default' }}>
              <Typography>{steps[activeStep].label}</Typography>
            </Paper>
            <Box sx={{ height: 255, maxWidth: 400, width: '100%', p: 2 }}>
              {steps[activeStep].component}
            </Box>
            <MobileStepper steps={maxSteps} position="static" activeStep={activeStep}
              nextButton={
                <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                  Next
                  <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                  <KeyboardArrowLeft />
                  Back
                </Button>
              }
            />
          </Box>
        </Grid>
        <Grid item xs={12} sx={{p: '15px'}}>
          <Typography variant="caption" display="block" gutterBottom>
            Just a reminder that, although we love your children, unfortunately we aren’t able to accommodate them at this time because of budget & space constraints 😢
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Info;