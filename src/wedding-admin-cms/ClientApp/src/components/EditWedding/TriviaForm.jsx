import React, { useEffect, useMemo, useState } from 'react';
import { useMsal } from '@azure/msal-react';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { addTrivia, closeTrivia, getTrivia } from '../../apis/triviaApi';
import { MenuItem } from '@mui/material';

const TriviaForm = (props) => {
  // state variables to populate the list of food items for the wedding
  const [trivia, setTrivia] = useState({});
  const [triviaQuestions, setTriviaQuestions] = useState([]);

  // state variables to be used when creating a new trivia
  const [triviaTitle, setTriviaTitle] = useState('');
  const [triviaDesc, setTriviaDesc] = useState('');
  const [isTriviaOpen, setIsTriviaOpen] = useState(false);

  // state variables to be used when creating a new trivia question
  const [triviaAnswer, setTriviaAnswer] = useState('');
  const [triviaQuestion, setTriviaQuestion] = useState('');
  const [triviaSortRank, setTriviaSortRank] = useState(10);

  const { weddingId, setErrorShowAlert, setSuccessShowAlert } = props;

  // MSAL, Azure B2C SSO, logic
  const msal = useMsal();
  const { instance, accounts } = msal;

  const silentRequest = useMemo(() => {
    return {
      scopes: [`${process.env.REACT_APP_B2C_URL}/${process.env.REACT_APP_B2C_SCOPES}`],
      account: accounts[0]
    }
  }, [accounts]);

  const addTriviaButtonClick = () => {
    console.log('adding trivia', triviaTitle, triviaDesc, isTriviaOpen);

    // TODO: implement add trivia logic
  };

  const addTriviaQuestionButtonClick = async () => {
    console.log('adding trivia', triviaQuestion, triviaAnswer, triviaSortRank);

    const questionToAdd = { question: triviaQuestion, answer: triviaAnswer, sortRank: triviaSortRank, triviaId: trivia.triviaId };
    const tokenCache = await instance.acquireTokenSilent(silentRequest);
    const resp = await addTrivia(questionToAdd, tokenCache.accessToken);

    if (resp.ok) setSuccessShowAlert(true);
    else setErrorShowAlert(true);
  };

  const closeTriviaButtonClick = async (status) => {
    console.log(status);

    const statusDto = { weddingId, triviaId: trivia.triviaId, status: status === 'close' ? false : true };
    const tokenCache = await instance.acquireTokenSilent(silentRequest);
    const resp = await closeTrivia(statusDto, tokenCache.accessToken);

    if (resp.ok) setSuccessShowAlert(true);
    else setErrorShowAlert(true);
  };

  useEffect(() => {
    const init = async () => {
      const tokenCache = await instance.acquireTokenSilent(silentRequest);
      const resp = await getTrivia(weddingId, tokenCache.accessToken);

      setTrivia(resp);
      setIsTriviaOpen(resp.isOpen);
      setTriviaQuestions(resp.triviaQuestions);
    };

    init();
  }, [instance, silentRequest, weddingId]);

  return (
    <>
      {trivia.triviaId !== undefined
        ? (
          <>
            {/* Trivia Info */}
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant='subtitle2'>
                  Selected Trivia: {trivia.title} ({trivia.isOpen ? 'Active' : 'Closed'})
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='caption'>{trivia.description}</Typography>
              </Grid>
            </Grid>

            <Divider />

            {/* adding trivia question section */}
            <Typography variant='subtitle2'>Add Trivia Question</Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField id="trivia-question" label="Question" variant="outlined" value={triviaQuestion}
                  onChange={e => setTriviaQuestion(e.target.value)} fullWidth multiline />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField id="trivia-answer" label="Answer" variant="outlined" value={triviaAnswer}
                  onChange={e => setTriviaAnswer(e.target.value)} fullWidth select
                >
                  <MenuItem value='Him'>Him</MenuItem>
                  <MenuItem value='Her'>Her</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField id="trivia-sort" label="Sort #" variant="outlined" value={triviaSortRank}
                  onChange={e => setTriviaSortRank(e.target.value)} fullWidth select
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={6}>6</MenuItem>
                  <MenuItem value={7}>7</MenuItem>
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={9}>9</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button onClick={addTriviaQuestionButtonClick} variant="contained" fullWidth>Add Trivia Question</Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button onClick={() => closeTriviaButtonClick(trivia.isOpen ? 'close' : 'open')}
                  variant="contained" color={trivia.isOpen ? 'error' : 'success'}
                  fullWidth
                >
                  {trivia.isOpen ? 'Close Trivia' : 'Open Trivia'}
                </Button>
              </Grid>
            </Grid>
          </>
        )
        : (
          <>
            {/* Section to add trivia */}
            <Typography variant='subtitle2'>Add Trivia</Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField id="trivia-title" label="Title" variant="outlined" value={triviaTitle} onChange={e => setTriviaTitle(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField id="trivia-desc" label="Description" variant="outlined" value={triviaDesc}
                  onChange={e => setTriviaDesc(e.target.value)} fullWidth multiline
                />
              </Grid>
              <Grid item xs={12}>
                <Button onClick={addTriviaButtonClick} variant="contained">Add Trivia</Button>
              </Grid>
            </Grid>
          </>
        )
      }

      <Divider sx={{ mb: '15px', mt: '15px' }} />

      {/* Section to list all the questions for the trivia */}
      <Typography variant='subtitle2'>Trivia Question(s)</Typography>
      <TableContainer component={Paper}>
        <Table dense>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell >Answer</TableCell>
              <TableCell align="right">Sort</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {triviaQuestions.map(triviaQuestion => (
              <TableRow key={triviaQuestion.triviaQuestionId}>
                <TableCell>{triviaQuestion.question}</TableCell>
                <TableCell>{triviaQuestion.answer}</TableCell>
                <TableCell align="right">{triviaQuestion.sortRank}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TriviaForm;