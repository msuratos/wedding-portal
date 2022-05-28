import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Alert, AppBar, Container, Snackbar, Toolbar, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';

import AboutUs from './pages/AboutUs';
import Background from './components/Background';
import Faq from './pages/Faq';
import Home from './pages/Home';
import Info from './pages/Info';
import Links from './pages/Links';
import NotFound from './pages/NotFound';
import Registry from './pages/Registry';
import Rsvp from './pages/Rsvp';

export const AlertContext = createContext({ options: { message: '', messageType: 'success', open: false }, setOptions: () => { } });
export const ValidPassphraseContext = createContext({ isValidPassphrase: true, setIsValidPassphrase: () => { } });

const App = () => {
  const [isValidPassphrase, setIsValidPassphrase] = useState(false);
  const [muiOptions, setMuiOptions] = useState({ message: '', messageType: 'success', open: false });

  useEffect(() => {
    function isExistingValidPassphrase() {
      // check local storage
      if (localStorage.getItem('validPassphrase'))
        setIsValidPassphrase(true);
    };

    isExistingValidPassphrase();
  }, []);

  return (
    <BrowserRouter>
      <Background />
      <AppBar position="static" sx={{ backgroundColor: blueGrey[500] }}>
        <Container maxWidth="xl">
          {/* TODO: find a way to rerender the dense on different page */}
          <Toolbar variant={new URL(window.location.href).pathname === '/links' ? 'regular' : 'dense'} disableGutters>
            <Typography variant="h6" noWrap component="div" sx={{ mr: 'auto', ml: 'auto', display: { xs: 'flex', md: 'flex' } }}>
              Melvin & Erlynn's Wedding 2.0!
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <AlertContext.Provider value={{ options: muiOptions, setOptions: setMuiOptions }}>
        <ValidPassphraseContext.Provider value={{ isValidPassphrase: isValidPassphrase, setIsValidPassphrase: setIsValidPassphrase }}>
          <Routes>
            <Route path="/">
              <Route index element={<Links />} />
              <Route path="home" element={<Home />} />
              {
                !isValidPassphrase ? <></> :
                  (
                    <>
                      <Route path="aboutus" element={<AboutUs />} />
                      <Route path="rsvp" element={<Rsvp />} />
                      <Route path="info" element={<Info />} />
                      <Route path="registry" element={<Registry />} />
                      <Route path="faq" element={<Faq />} />
                    </>
                  )
              }
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ValidPassphraseContext.Provider>

        {/* notification alerts */}
        <Snackbar key='bottom-center' anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={() => setMuiOptions({ open: false })}
          open={muiOptions.open}
          autoHideDuration={3000}
        >
          <Alert severity={muiOptions.type} onClose={() => setMuiOptions({ open: false })}>{muiOptions.message}</Alert>
        </Snackbar>
      </AlertContext.Provider>
    </BrowserRouter>
  );
}

export default App;
