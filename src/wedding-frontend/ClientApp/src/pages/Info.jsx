import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';

import {
  Avatar, Box, Button, Divider, Grid, List, ListItem, ListItemAvatar,
  ListItemButton, ListItemText, MobileStepper, Paper, Typography
} from '@mui/material';

import { blueGrey, grey } from '@mui/material/colors';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import ChurchIcon from '@mui/icons-material/Church';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LiquorIcon from '@mui/icons-material/Liquor';
import PaletteIcon from '@mui/icons-material/Palette';

import ParkingPicture from '../assets/parking.png';
import WeddingCalendar from '../assets/merlynn-wedding.ics';

const Info = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const ceremonyReceptionDetails = (
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

  const parking = (
    <div>
      <img src={ParkingPicture} alt="parking-pic" title="parking-pic" width='100%' style={{ objectFit: 'cover' }}
        onClick={() => window.open(ParkingPicture)} />
      <Typography variant='body2' display='block' gutterBottom>
        We recommend to carpool with others. The parking lot directly near the venue is limited, though there is still parking in the lot perpendicular to the plaza.
      </Typography>
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

  const handleStepChange = (step) => {
    setActiveStep(step);
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
            <SwipeableViews axis='x' index={activeStep} onChangeIndex={handleStepChange} enableMouseEvents>
              {steps.map((step, index) => (
                <div key={step.label}>
                  {step.component}
                </div>
              ))}
            </SwipeableViews>
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
      </Grid>
    </Paper>
  );
};

export default Info;