import * as React from 'react'
import { useState, useEffect, PropsWithChildren } from "react"

import Typography from '@material-ui/core/Typography'

import { ApolloProvider } from "@apollo/client"
import { createApolloClient } from '../apollo/client';
import { subscribeToUser, UserInfo } from '../auth';
import { Container, Grid } from '@material-ui/core';

type AuthProps = {
  children: React.ReactNode
}

export type AuthContextInfo = {
  user: UserInfo
}

export const AuthContext = React.createContext<AuthContextInfo>({ user: { email: "", username: "", token: "" } });

export default function AuthProvider({ children }: AuthProps) {
  const [user, setUser] = useState<UserInfo | undefined>();

  useEffect(() => {
    subscribeToUser(({ user }) => {
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
    return <Container>
      <Typography variant="h3" align="center">You need to login first</Typography>
    </Container>

  const apolloClient = createApolloClient(token);

  return <AuthContext.Provider value={{ user }}>
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  </AuthContext.Provider>
}