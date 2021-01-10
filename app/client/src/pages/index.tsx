import { Typography } from '@material-ui/core';
import * as React from 'react'
import { useState, useEffect, useContext } from "react"

import App from '../components/app';
import AuthProvider, { AuthContext } from '../components/AuthProvider';
import Layout from '../components/Layout'

export default function Index() {
  return (
    <Layout title="Cats">
      <AuthProvider>
        <App />
      </AuthProvider>
    </Layout>
  );
}