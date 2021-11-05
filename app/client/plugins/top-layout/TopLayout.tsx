import React from 'react';
import { Helmet } from 'react-helmet';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
import theme from '../../src/theme';


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


type TopLayoutProps = {
  children: React.ReactNode
}

export default function TopLayout({children} : TopLayoutProps) {
  return (
    <React.Fragment>
      <Helmet>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Helmet>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </ThemeProvider>
      </StyledEngineProvider>
    </React.Fragment>
  );
}