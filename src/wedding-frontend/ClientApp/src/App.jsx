import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';

import Background from './components/Background';
import Home from './pages/Home';
import Info from './pages/Info';
import Links from './pages/Links';
import NotFound from './pages/NotFound';
import Rsvp from './pages/Rsvp';

const App = () => {
  const [isValidPassphrase, setIsValidPassphrase] = useState(false);

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
      {/* TODO: remove this conditional once deployed using links as default page */}
      {new URL(window.location.href).pathname === '/' ? <></>
        : (
          <>
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
          </>
        )
      }

      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="links" element={<Links />} />
          {
            !isValidPassphrase ? <></> :
              (
                <>
                  <Route path="rsvp" element={<Rsvp />} />
                  <Route path="info" element={<Info />} />
                </>
              )
          }
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
