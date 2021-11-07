import React from "react";

import { MsalProvider } from "@azure/msal-react";
import { Configuration,  PublicClientApplication } from "@azure/msal-browser";
import { Container, Typography } from "@mui/material";

// MSAL configuration
const configuration: Configuration = {
    auth: {
        clientId: "af93172a-05bb-4656-aee9-221bbbf9fffe"
    }
};

const pca = new PublicClientApplication(configuration);

type AuthProps = {
  children: React.ReactNode
}

// Component
export default function AzureAuthProvider ({children} : AuthProps) {

      {/* {children} */}
    return <MsalProvider instance={pca}>
<Container>
      <Typography variant="h3" align="center">You need to login first</Typography>
    </Container>
    </MsalProvider>
}

//     <MsalProvider instance={pca}>
//       {children}
//     </MsalProvider>
// );