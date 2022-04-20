import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Button from '@mui/material/Button';

const theme = createTheme({
  palette: {
    neutral: {
      main: '#ffffff',
      contrastText: grey['A700'],
    },
  },
});

const WhiteButton = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Button color="neutral" variant="contained" {...props}>
        {props.children}
      </Button>
    </ThemeProvider>
  );
};

export default WhiteButton;