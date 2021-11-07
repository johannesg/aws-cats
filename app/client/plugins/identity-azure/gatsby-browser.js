/* eslint-disable import/prefer-default-export */
import * as React from 'react';
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";


// MSAL configuration
const configuration = {
  auth: {
    clientId: "fc96601f-d80d-4c51-8ece-7e45fe695961",
    authority: "https://jogustest.b2clogin.com/jogustest.onmicrosoft.com/B2C_1_standard",
    knownAuthorities: ["jogustest.b2clogin.com"] // array of URIs that are known to be valid
  }
};

const apiConfig = {
  b2cScopes: ["https://<your-tenant>.onmicrosoft.com/<your-api>/<your-scope>"],
  webApiUri: "<your-api-uri>" // e.g. "https://fabrikamb2chello.azurewebsites.net/hello"
};

const loginRequest = {
  scopes: [ "openid", "offline_access" ]
}

const tokenRequest = {
  scopes: apiConfig.b2cScopes // e.g. "https://<your-tenant>.onmicrosoft.com/<your-api>/<your-scope>"
}

const pca = new PublicClientApplication(configuration);

function ErrorComponent({error}) {
  return <p>An Error Occurred: {error}</p>;
}

function LoadingComponent() {
  return <p>Authentication in progress...</p>;
}

export const wrapRootElement = ({ element }) => {
  const authRequest = {
    scopes: ["openid", "profile"]
};
  // return element;
  return <MsalProvider instance={ pca }>
        <MsalAuthenticationTemplate 
            interactionType={InteractionType.Popup} 
            authenticationRequest={authRequest} 
            errorComponent={ErrorComponent} 
            loadingComponent={LoadingComponent}
        >
          { element }
        </MsalAuthenticationTemplate>
    </MsalProvider>
};