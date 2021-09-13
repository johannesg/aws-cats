/* eslint-disable import/prefer-default-export, react/prop-types */
// import awsConfig from "./aws-config"

import Amplify from "@aws-amplify/auth"
// import { AuthenticationProvider } from './src/components/amplify';

export function onClientEntry(_, { region, userPoolId, userPoolWebClientId}) {
    const options = { region, userPoolId, userPoolWebClientId };
    console.log(`Amplify config: ${JSON.stringify(options)}`);
    Amplify.configure(options);
}

// Amplify.configure(awsConfig);
