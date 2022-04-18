import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';

const theme = createTheme({
  palette: {
    neutral: {
      main: '#ffffff',
      contrastText: '#fff',
    },
  },
});

const WhiteButton = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Button color="neutral" variant="outlined" {...props}>
        {props.children}
      </Button>
    </ThemeProvider>
  );
};

export default WhiteButton;