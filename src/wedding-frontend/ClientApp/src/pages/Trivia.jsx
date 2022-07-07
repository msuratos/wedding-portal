import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import ListPageLayout from '../components/ListPageLayout';
import { getTrivia } from '../apis/triviaApi';

const Trivia = () => {
  const [canSeeQuestions, setCanSeeQuestions] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [username, setUsername] = useState('');
  const [trivia, setTrivia] = useState({});

  console.log(trivia);

  const onUsernameButtonClick = () => {
    setUsername(username);
    localStorage.setItem('username', username);

    setCanSeeQuestions(true);
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
          !canSeeQuestions
            ? (
              <>
                <TextField label='Full Name' sx={{ mb: '5px' }} value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
                <Button color='primary' variant='contained' onClick={onUsernameButtonClick} fullWidth>Submit</Button>
              </>
            )
            : (
              <ul>
                {/* TODO: switch to swipeable views for each question */}
                {
                  questions.map(question => <li key={question.triviaQuestionId}>{question.question}</li>)
                }
              </ul>
            )
        }
      </Grid>
    </ListPageLayout>
  );
};

export default Trivia;