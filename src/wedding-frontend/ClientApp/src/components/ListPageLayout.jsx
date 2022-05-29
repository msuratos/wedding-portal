import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ListPageLayout = (props) => {
  const navigate = useNavigate();
  const { hasTitle, title } = props;

  return (
    <Paper elevation={3} sx={{ m: '15px' }}>
      <Grid container sx={{ p: '5px' }}>
        <Grid item xs={12}>
          <Button onClick={() => navigate(-1)}><ArrowBackIcon />back to links</Button>
          {hasTitle && (
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
              {title}
            </Typography>  
          )}
        </Grid>
        {props.children}
      </Grid>
    </Paper>
  );
};

export default ListPageLayout;