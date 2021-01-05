
import * as React from "react"
import { PageProps } from "gatsby"

import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
// import Link from '../components/Link'
import Dashboard from '../components/dashboard/Dashboard'
import { withAuthenticator } from '@aws-amplify/ui-react';

export default withAuthenticator(Dashboard);