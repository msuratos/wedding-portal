import React, { useContext, useEffect, useState } from 'react';
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

import { AlertContext } from '../App';
import { getWeddingPhotos } from '../apis/weddingApi';

const steps = [
  {
    label: 'The Meeting',
    optional: '~August 2008 (Freshman HS)',
    picUrl: '',
    description: `To be honest, we don't remember of our very first encouter. All we know is
              is that we met sometime in freshman year of high school, most likely
              french class or through mutual friends. Fun fact, Erlynn actually met Calvin first!`
  },
  {
    label: 'Something\'s Brewing.. 😉',
    optional: '~2009-2011',
    picUrl: '',
    description: `Throughout high school, we had classes together and were 
              mutual friends. Then, junior year, we had a physics class together
              and were partners for a group project. We went to the library after
              school one day and during one of our breaks, I impressed her with
              some of my dance moves. Some would say this was the start of our love
              story & us liking each other 😉`,
  },
  {
    label: 'Where It Began',
    optional: '2011-2012',
    picUrl: '',
    description: `During our senior year, homecoming was around the corner. One of our friends,
              Kevin, randomly had a conversation with me suggesting to ask Erlynn. Lo and behold,
              I eventually asked her last minute to become my date with a
              treasure hunt & roses at Nevada Trails Park. Throughout the school year, we
              stayed in the 'talking' phase and were each other's dates for the rest of
              the school dances (sadies & prom). Also, within this year,
              Erlynn celebrated her Debut (Philippine's version of a sweet 16), in which
              she asked me to be her debut partner. Thus, us getting to know each other
              more personally & igniting the spark even more.`,
  },
  {
    label: 'Official!',
    optional: 'July 6, 2012',
    picUrl: '',
    description: `After high school graduation & in the middle of the summer, we decided to make it official. 
              It started out by me asking Erlynn's parents for permission to date her, which was nerve
              wrecking to say the least. Thankfully, they gladly accepted. I had a whole date planned out
              that day that eventually ended up in the Bellagio water fountains. During the water show, that's
              when I finally asked her to become my girlfriend.`,
  },
  // insert various trips and random occasions with pictures
  {
    label: 'Making It Permanent',
    optional: 'November 9, 2019',
    picUrl: '',
    description: `After 7 years of dating, growing, and loving each other, it was time to make it permanent.
              The proposal started off by taking her out for dinner before she hung out with her
              cousins. They planned to "hang out" to test a "random friend's" treasure hunt app.
              Her cousins drove her to significant places that meant something to both of us.
              While this was happening, friends and families were gathering at Nevada Trails Park,
              back to where it all began, as this was the last place for the treasure hunt. The
              final treasure was me proposing with a ring asking her to be my wife forever!`,
  },
  {
    label: 'Wedding 1.0!',
    optional: 'July 6, 2020',
    picUrl: '',
    description: `We definitely wanted to keep our "dating" date as our wedding date and get married during
              this time. However, due to COVID, it was difficult to plan a big wedding. So, we just ended up
              having a small civil wedding with close family. It started out with a hot air balloon ride,
              then a small ceremony at a random chapel in downtown LV (Viva Las Vegas! HAHA), and finally our
              reception/lunch at the restaurant, Maggiano's. Small & simple, but still a day full of love.
              Fun Fact, our wedding 2.0 will be catered by Maggiano's! `
  },
  {
    label: 'Got A Little Furball',
    optional: 'October 9, 2020',
    picUrl: '',
    description: `One day, we spontaneously decided to drive all the way to Idaho to adopt our mini
              Australian Shepherd puppy, Astro Blue. He only weighed 15 lbs at the time compared to
              his current weight at 38 lbs! Fun fact, his birthday is on our wedding day this year!
              He was born on July 8, 2020, and will turn 2 years old that day! So it's partly a birthday
              celebration too 😜`
  },
  {
    label: 'Wedding 2.0!',
    optional: 'July 8, 2022',
    picUrl: '',
    description: `The next milestone of our relationship is our Catholic church wedding in July. We wanted 
              to celebrate it big with all of you since it will also be our 10th year anniversary of being
              together. We cannot wait & are looking forward to celebrate this special day with all of you!`
  }
];
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const AboutUs = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [images, setImages] = useState([]);
  const [activeImageStep, setActiveImageStep] = useState(0);

  const alertContext = useContext(AlertContext);

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
      try {
        const images = await getWeddingPhotos();
        setImages(images);
      }
      catch (error) {
        console.error(error);
        alertContext.setOptions({ type: 'error', message: error.message, open: true });
      }
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
      {images.length === 0 ? <></>
        :
        <Paper square elevation={3} sx={{ m: '15px' }}>
          <AutoPlaySwipeableViews axis='x' index={activeImageStep} onChangeIndex={handleImageStep} enableMouseEvents>
            {images.map((image, index) => (
              <div key={image.photoId}>
                {Math.abs(activeImageStep - index) <= images.length ? (
                  <Box component="img" src={image.imgPath} alt={image.label}
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
      }
    </>
  );
};

export default AboutUs;