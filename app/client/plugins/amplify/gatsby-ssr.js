/* eslint-disable import/prefer-default-export, react/prop-types */
import awsConfig from "./aws-config"

import Amplify from "@aws-amplify/auth"
// import { AuthenticationProvider } from './src/components/amplify';

Amplify.configure(awsConfig);