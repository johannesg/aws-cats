import * as React from 'react'
import { useState, useEffect, PropsWithChildren } from "react"
import { PageProps } from "gatsby"

import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Link from '../components/Link'

import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { ApolloProvider } from "@apollo/client"
import { createApolloClient } from '../apollo/client';

import App from '../components/app';

type ContainerProps = PropsWithChildren<{}>

function LoggedInContainer({ children } : ContainerProps) {
  const [authState, setAuthState] = useState<AuthState>();
  const [user, setUser] = useState<any | undefined>();

  useEffect(() => {
    onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
      if (nextAuthState === AuthState.SignedIn) {
        console.log("user successfully signed in!");
        console.log("user data: ", authData);
      }
      if (!authData) {
        console.log("user is not signed in...");
      }
    })
  });

  if (!(authState === AuthState.SignedIn && user))
    return <AmplifyAuthenticator />;

  const token = user.getSignInUserSession()?.getIdToken()?.getJwtToken();

  const apolloClient = createApolloClient(token);

  return <div>
    <Typography variant="h5" component="h1" gutterBottom>
      Hello {user.username}
    </Typography>
    <AmplifySignOut />
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  </div>;
}

export default function Index() {
  return (
    <Container maxWidth="sm"> 
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gatsby v4-beta example
        </Typography>
        <LoggedInContainer>
          <App/>
        </LoggedInContainer>
      </Box>
    </Container>
  );
}