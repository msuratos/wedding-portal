import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Accordion, AccordionDetails, AccordionSummary,
  Button, Grid, Paper, Typography
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ParkingPicture from '../assets/parking.png';

const Faq = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Paper elevation={2} sx={{ m: '15px' }}>
      <Grid container sx={{ p: '5px' }}>
        <Grid item xs={12}>
          <Button onClick={() => navigate(-1)}><ArrowBackIcon />back to links</Button>
        </Grid>
        <Grid item xs={12}>
          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
              <Typography>
                Contact Us
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2' display='block'>
                Melvin Suratos - <a href="tel:7027885768">(702) 788-7568</a>
              </Typography>
              <Typography variant='body2' display='block'>
                Erlynn Jade Suratos - <a href="tel:7022028975">(702) 788-7568</a>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2bh-content" id="panel2bh-header">
              <Typography>Can we bring our kids?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2' display='block'>
                Although we love your children, unfortunately we aren’t able to accommodate them at this time because of budget & space constraints 😢
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3bh-content" id="panel3bh-header">
              <Typography>
                Where can we park?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2' display='block'>
                Anywhere in the plaza. Please see the image below to see where.
              </Typography>
              <img src={ParkingPicture} alt="parking-pic" title="parking-pic" width='100%' style={{ objectFit: 'cover' }}
                onClick={() => window.open(ParkingPicture)} />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Faq;