import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Box, Grid, MobileStepper, Paper, Step,
  StepContent, StepLabel, Stepper, Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

const steps = [
  {
    label: 'The Meeting',
    optional: '~August 2008 (Freshman HS)',
    picUrl: '',
    description: `To be honest, we don't remember of our very first encouter. All we know is
              is that we met sometime in freshman year of high school, most likely
              french class or through mutual friends. Fun fact, Erlynn met Calvin first!`
  },
  {
    label: 'Something\'s Brewing.. 😉',
    optional: '~2009-2011',
    picUrl: '',
    description: `Throughout high school, we've had classes together and were 
              mutual friends. Then, junior year, we had physics class together
              and were partners for a group project. One of the days, while working
              on the project, Melvin decided to show off a little and perform a little
              break dance routine. Maybe this was the start of our romance.`,
  },
  {
    label: 'Where It Began',
    optional: '2011-2012',
    picUrl: '',
    description: `During our senior year, homecoming was around the corner and Melvin
              was wondering who take. One of our friends, Kevin, had a conversation with him
              suggesting to take Erlynn. Lo and behold, Melvin asked Erlynn to become his
              date to homecoming by asking her at the Nevada Trails park with some roses.
              The rest of the school year, we were in the 'talking' phase and were each
              other's date for the rest of the school dances: sadies & prom. Both had
              their own significant way of being asked: treasure hunt & flash mob.`,
  },
  {
    label: 'The Debut!',
    optional: 'May 27, 2020',
    picUrl: '',
    description: `For Erlynn's celebration of coming of age at 18, she asked Melvin
              to be her debut partner! Thus igniting the spark between them even more
              and growing closer together`,
  },
  {
    label: 'Official!',
    optional: 'July 6, 2012',
    picUrl: '',
    description: `After high school graduation in the middle of the summer, Melvin asked
              Erlynn to officially become his girlfriend! It started out by asking Erlynn's
              parents for permission, then had a long date that that ended up in Bellagio
              water fountains. During the water show, that's when Melvin asked Erlynn
              to become his girlfriend`,
  },
  // insert various trips and random occasions with pictures
  {
    label: 'Making It Permanent',
    optional: 'November 9, 2019',
    picUrl: '',
    description: `After 7 years, it was time to make it permanent. Our love for each other
              has grown so much that we wanted to make it last forever. Melvin's way of
              the proposal was taking her out for dinner before she 'hangs' out with her
              cousins. They were suppose to test of their friend's treasure hunt app.
              They had to go to several significant places for both of us to get the next clue.
              While this was happening, friends and families were meeting at Nevada Trails Park,
              back to where it all began, as this was the last place for the treasure hunt. The
              treasure was Melvin asking Erlynn to become his wife!`,
  },
  {
    label: 'Wedding 1.0!',
    optional: 'July 6, 2020',
    picUrl: '',
    description: `We wanted to have the wedding at this date, however, due to COVID, it was
              difficult to plan a big wedding. So, we had a small civil wedding with close
              family.`
  },
  {
    label: 'Got A Little Furball',
    optional: 'October 9, 2020',
    picUrl: '',
    description: `We got our mini Australian Shepherd puppy weighing at 15 lbs! Fun fact,
              his birthday is on our wedding day this year! He was born on July 8, 2022,
              making him 2 years old on our wedding day!!`
  },
  {
    label: 'Wedding 2.0!',
    optional: 'July 8, 2022',
    picUrl: '',
    description: `The next milestone of our relationship, the big wedding we were hoping to
              have. We're looking forward to celebrate this day with you!`
  }
];

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const AboutUs = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [images, setImages] = useState([]);
  const [activeImageStep, setActiveImageStep] = useState(0);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleBack = () => {
    setActiveImageStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleImageNext = () => {
    setActiveImageStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleImageStep = (step) => {
    setActiveImageStep(step);
  };

  useEffect(() => {
    // TODO: get vertical steppers dynamically
    async function getImages() {
      const resp = await fetch('/api/wedding/photos');

      if (resp.ok)
        setImages(await resp.json());
      else
        console.error('Error getting images');
    }

    getImages();
  }, []);

  return (
    <>
      {/* Vertical stepper of a timeline of how we met and about us */}
      <Paper elevation={3} sx={{ m: '15px' }}>
        <Grid container sx={{ p: '5px' }}>
          <Grid item xs={12}>
            <Button onClick={() => navigate(-1)}><ArrowBackIcon />back to links</Button>
          </Grid>
          <Grid item xs={12}>
            <Stepper nonLinear activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel optional={step.optional} onClick={handleStep(index)}>{step.label}</StepLabel>
                  <StepContent>
                    <Typography variant="caption" display="block" gutterBottom>{step.description}</Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length - 1 && (<Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>back to start</Button>)}
          </Grid>
        </Grid>
      </Paper>

      {/* Carousel of images of the wedding shoot */}
      <Paper square elevation={3} sx={{ m: '15px' }}>
        <AutoPlaySwipeableViews axis='x' index={activeImageStep} onChangeIndex={handleImageStep} enableMouseEvents>
          {images.map((step, index) => (
            <div key={step.label}>
              {Math.abs(activeImageStep - index) <= images.length ? (
                <Box component="img" src={step.imgPath} alt={step.label}
                  sx={{
                    height: 400,
                    display: 'block',
                    objectFit: 'scale-down',
                    maxWidth: 400,
                    overflow: 'hidden',
                    width: '100%',
                  }}
                />
              ) : null}
            </div>
          ))}
        </AutoPlaySwipeableViews>
        <MobileStepper variant="progress" steps={images.length} position="static" activeStep={activeImageStep}
          nextButton={
            <Button size="small" onClick={handleImageNext} disabled={activeImageStep === images.length - 1}>
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeImageStep === 0}>
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
      </Paper>
    </>
  );
};

export default AboutUs;