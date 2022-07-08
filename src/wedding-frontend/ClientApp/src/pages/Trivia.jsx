import React, { useEffect, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MobileStepper from '@mui/material/MobileStepper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import ListPageLayout from '../components/ListPageLayout';
import { getTrivia, postAnswer } from '../apis/triviaApi';

const Trivia = () => {
  const [completedForm, setCompletedForm] = useState(false);
  const [canSeeQuestions, setCanSeeQuestions] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [username, setUsername] = useState('');
  const [trivia, setTrivia] = useState({});

  // state for mobilestepper, mobile view
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const onUsernameButtonClick = () => {
    setUsername(username);
    localStorage.setItem('username', username);

    setCanSeeQuestions(true);
  };

  const onHimHerButtonClick = async (name, triviaQuestionId) => {
    const resp = await postAnswer({ username, userAnswer: name, triviaQuestionId });

    if (resp.ok) {
      setActiveStep(activeStep + 1);
      localStorage.setItem('completed', true);
    }
    else {
      alert(`Something went wrong, please try again or ${await resp.text()}`);
    }

    if (activeStep + 1 === questions.length)
      setCompletedForm(true);
  };

  useEffect(() => {
    const init = async () => {
      const resp = await getTrivia();
      setTrivia(resp);
      setQuestions(resp.triviaQuestions);

      const username = localStorage.getItem('username');
      if (username !== null && username !== '') {
        setUsername(username);
        setCanSeeQuestions(true);
      }

      const completed = localStorage.getItem('completed');
      if (completed !== null && completed !== '') {
        setCompletedForm(completed);
      }
    };

    init();
  }, []);

  return (
    <ListPageLayout>
      <Grid item xs={12}>
        <Typography variant='h4' sx={{ fontFamily: 'Rastanty', textAlign: 'center' }}>Shoe Game</Typography>
        <Divider />
      </Grid>
      <Grid item xs={12} sx={{ pt: '10px' }}>
        {
          completedForm ? <Typography variant='h6' gutterBotom>You have submitted already, no retries 😊</Typography>
            : !trivia.isOpen ? <Typography variant='h6' sx={{ textAlign: 'center' }} gutterBttom>Trivia is closed... 😢</Typography>
              :
              !canSeeQuestions
                ? (
                  <>
                    <TextField label='Full Name' sx={{ mb: '5px' }} value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
                    <Button color='primary' variant='contained' onClick={onUsernameButtonClick} fullWidth>Submit</Button>
                  </>
                )
                : (
                  <>
                    <SwipeableViews axis='x' index={activeStep} onChangeIndex={handleStepChange} enableMouseEvents>
                      {questions.map(question => (
                        <div key={question.triviaQuestionId}>
                          <Typography variant='h6' gutterBottom sx={{ textAlign: 'center' }}>{question.question}</Typography>
                          <Button color='primary' variant='contained' sx={{ width: '50%' }} onClick={() => onHimHerButtonClick('Him', question.triviaQuestionId)}>Him</Button>
                          <Button color='secondary' variant='contained' sx={{ width: '50%' }} onClick={() => onHimHerButtonClick('Her', question.triviaQuestionId)}>Her</Button>
                        </div>
                      ))}
                    </SwipeableViews>
                    <MobileStepper steps={questions.length} position="static" activeStep={activeStep}
                      nextButton={
                        <Button size="small" onClick={handleNext} disabled={activeStep === questions.length - 1}>
                          Next
                          <KeyboardArrowRight />
                        </Button>
                      }
                      backButton={
                        <Button size="small" onClick={handleBack} disabled={true}>
                          <KeyboardArrowLeft />
                          Back
                        </Button>
                      }
                    />
                  </>
                )
        }
      </Grid>
    </ListPageLayout>
  );
};

export default Trivia;