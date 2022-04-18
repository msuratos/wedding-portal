import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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
