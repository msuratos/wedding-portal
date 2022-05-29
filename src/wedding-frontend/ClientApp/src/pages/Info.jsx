import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';

import {
  Box, Button, Grid,
  MobileStepper, Paper, Typography
} from '@mui/material';

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import CeremonyReceptionDetails from '../components/Info/CeremonyReceptionDetails';
import DressCode from '../components/Info/DressCode';
import ListPageLayout from '../components/ListPageLayout';
import Parking from '../components/Info/Parking';

const Info = () => {
  const [activeStep, setActiveStep] = useState(0);

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
    <ListPageLayout>
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
    </ListPageLayout>
  );
};

export default Info;