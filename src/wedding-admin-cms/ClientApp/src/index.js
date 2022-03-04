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
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated && inProgress === InteractionStatus.None)
      instance.loginRedirect(loginRequest);
  }, [inProgress, instance, isAuthenticated]);

  return (
    <>
      <h3>Login</h3>
      <p>Attempting log you in.. redirecting...</p>
    </>
  );
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