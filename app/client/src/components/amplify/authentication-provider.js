import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';

const AuthenticationProvider = (props) => (
    React.cloneElement(props.children, { authState: props.authState, authData: props.authData })
);

export default withAuthenticator(AuthenticationProvider, {

});