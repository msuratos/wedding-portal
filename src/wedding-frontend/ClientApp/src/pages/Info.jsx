import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';

import {
  Box, Button, Grid,
  MobileStepper, Paper, Typography
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import CeremonyReceptionDetails from '../components/Info/CeremonyReceptionDetails';
import DressCode from '../components/Info/DressCode';
import Parking from '../components/Info/Parking';

const Info = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      'label': 'Ceremony & Reception',
      'component': CeremonyReceptionDetails
    },
    {
      'label': 'Dress Code',
      'component': DressCode
    },
    {
      'label': 'Parking',
      'component': Parking
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