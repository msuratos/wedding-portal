import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Accordion, AccordionDetails, AccordionSummary,
  Button, Link, Grid, Paper, Typography
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
                Erlynn Jade Suratos - <a href="tel:7022028975">(702) 202-8975</a>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2bh-content" id="panel2bh-header">
              <Typography>Can we bring our kids?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2' display='block'>
                Although we love your children, unfortunately, we aren’t able to accommodate them at this time because of budget & space constraints 😢
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3bh-content" id="panel3bh-header">
              <Typography>
                Where should we park?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2' display='block'>
                Please refer to the 'Wedding Details' link. Carpool if you can!
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4bh-content" id="panel4bh-header">
              <Typography>
                What is the address to the church & reception?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2' display='block'>
                Please tap on the names of the church and venue under the 'Wedding Details' link; it should redirect you to the addresses on Google Maps
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel5bh-content" id="panel5bh-header">
              <Typography>
                What is the dress code?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2' display='block'>
                Please refer to the 'Wedding Details' link
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel6bh-content" id="panel6bh-header">
              <Typography>
                Will it be an outdoor wedding?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2' display='block'>
                Definitely not, Vegas summers are the worst! It will all be indoors 😊
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel7'} onChange={handleChange('panel7')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel7bh-content" id="panel7bh-header">
              <Typography>
                Where should we stay if we're from out of town?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2' display='block'>
                Save money & stay with friends/family in town, if possible! If not, the venue will be around the Summerlin area. Hotels nearby include:
                <Link component="button" variant="body2" onClick={() => window.open("https://www.redrockresort.com/")}>Red Rock Casino Resorts & Spa</Link> and
                <Link component="button" variant="body2" onClick={() => window.open("https://www.suncoastcasino.com/")}>SunCoast Hotel & Casino</Link>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel8'} onChange={handleChange('panel8')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel8bh-content" id="panel8bh-header">
              <Typography>
                Will there be an open bar?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2' display='block'>
                Yes! We will be having cocktail hour from 6pm-7pm
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel9'} onChange={handleChange('panel9')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel9bh-content" id="panel9bh-header">
              <Typography>
                I can't make it to the ceremony, but I can make it to the reception. How do I RSVP?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2' display='block'>
                Just hit the RSVP button on the main page! The RSVP is only for the reception, the ceremony doesn't require RSVP.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Faq;