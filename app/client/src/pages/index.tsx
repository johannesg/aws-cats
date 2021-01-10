import * as React from 'react'
import { useState, useEffect, PropsWithChildren } from "react"

import Typography from '@material-ui/core/Typography'
import Link from '../components/Link'

import { ApolloProvider } from "@apollo/client"
import { createApolloClient } from '../apollo/client';
import { AuthEvent, subscribeToUser, UserInfo } from '../auth';

import App from '../components/app';
import { CognitoUser } from '@aws-amplify/auth'
import Layout from '../components/Layout'

type ContainerProps = PropsWithChildren<{}>

function LoggedInContainer({ children }: ContainerProps) {
  const [user, setUser] = useState<UserInfo | undefined>();

  useEffect(() => {
    subscribeToUser(({ user }: AuthEvent) => {
      setUser(user);
      if (user)
        console.log("user successfully signed in!");
      else {
        console.log("user is not signed in...");
      }
    })
  }, []);

  const token = user?.token;

  if (!user || !token)
    return <Typography variant="h3" align="center">You need to login first</Typography>

  const apolloClient = createApolloClient(token);

  return <div>
    <Typography variant="h5" align="center" component="h1" gutterBottom>
      Hello {user.username}
    </Typography>
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  </div>;
}

export default function Index() {
  return (
    <Layout title="Cats">
      <LoggedInContainer>
        <App />
      </LoggedInContainer>
    </Layout>
  );
}