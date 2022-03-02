import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { PublicClientApplication } from '@azure/msal-browser';
import { AuthenticatedTemplate, UnauthenticatedTemplate, MsalProvider, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { msalConfig, b2cPolicies } from "./utils/authConfig";

import App from './App';
import 'bootstrap/dist/css/bootstrap.css';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');
const msalInstance = new PublicClientApplication(msalConfig);

const Login = () => {
  const msal = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated)
      msal.instance.loginRedirect(b2cPolicies.authorities.signUpSignIn);
  }, []);

  return (
    <div>
      <h3>Login</h3>
      <p>Redirecting you to login with Azure B2C</p>
    </div>
  );
};

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <MsalProvider instance={msalInstance}>
      <AuthenticatedTemplate>
        <App />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Login />
      </UnauthenticatedTemplate>
    </MsalProvider>
  </BrowserRouter>,
  rootElement);