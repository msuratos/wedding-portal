import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { PublicClientApplication, InteractionStatus } from '@azure/msal-browser';
import { AuthenticatedTemplate, UnauthenticatedTemplate, MsalProvider, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { msalConfig, loginRequest } from "./utils/authConfig";

import App from './App';
import 'bootstrap/dist/css/bootstrap.css';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');
const msalInstance = new PublicClientApplication(msalConfig);

const Login = () => {
  const { instance, accounts, inProgress } = useMsal();

  if (accounts.length > 0) {
    return <span>There are currently {accounts.length} users signed in!</span>
  } else if (inProgress === "login") {
    return <span>Login is currently in progress!</span>
  } else {
    return (
      <>
        <h3>Login!</h3>
        <span>There are currently no users signed in!</span>
        <div>
          {/* TODO: something wrong with the B2C /oauth2/token endpoint. Look at network request */}
          <button onClick={() => instance.loginRedirect(loginRequest)}>Login</button>
        </div>
      </>
    );
  }
};

ReactDOM.render(
  <MsalProvider instance={msalInstance}>
    <AuthenticatedTemplate>
      <BrowserRouter basename={baseUrl}>
        <App />
      </BrowserRouter>
    </AuthenticatedTemplate>
    <UnauthenticatedTemplate>
      <Login />
    </UnauthenticatedTemplate>
  </MsalProvider>,
  rootElement);