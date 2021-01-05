import * as React from "react"
import { useState, useEffect } from "react"
import { PageProps } from "gatsby"

import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Link from '../components/Link'

import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { ApolloProvider } from "@apollo/client"
import { createApolloClient } from '../apollo';

function AuthContainer() {
  const [authState, setAuthState] = useState<AuthState>();
  const [user, setUser] = useState<object | undefined>();

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
  console.log(`Token: ${token}`);

  const apolloClient = createApolloClient(token);

  return <div>
    <div>Hello, {user.username}</div>
    <AmplifySignOut />
    <ApolloProvider client={apolloClient}>

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
        <Link to="/signin" color="secondary">
          Login
        </Link>
        <AuthContainer />
      </Box>
    </Container>
  );
}