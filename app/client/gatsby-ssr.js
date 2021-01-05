// import * as React from "react"
// import { PluginOptions, PageProps } from "gatsby"
import awsConfig from "./aws-config"

import Amplify from "aws-amplify"
// import { AuthenticationProvider } from './src/components/amplify';

Amplify.configure(awsConfig);

// export function wrapPageElement({element, props}, options) {
//     return <AuthenticationProvider>{element}</AuthenticationProvider>
// }