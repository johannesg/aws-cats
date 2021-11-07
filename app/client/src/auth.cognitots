
import { Auth, CognitoUser } from '@aws-amplify/auth'
import { publish, subscribe } from './pubsub';

export type UserInfo = {
    username: string
    email: string
    token: string
}

function mapCognitoUser(user : CognitoUser) : UserInfo | undefined {
    if (user)
        return {
            username: user.getUsername(),
            email: "",
            token: user?.getSignInUserSession()?.getIdToken()?.getJwtToken() ?? ""
        }
    else
        return undefined;
}

export async function getUser() : Promise<UserInfo | undefined> {
    try {
        const user = await Auth.currentAuthenticatedUser();
        return mapCognitoUser(user);
    } catch (_) {
        return undefined;
    }
}

export async function login(username: string, password: string) {
    try {
        const user = await Auth.signIn(username, password);
        publish("auth", {
            user: mapCognitoUser(user)
        });
        console.log("User logged in", user);
    } catch (err) {
        console.log("Failed to login", err);
    }
}

export async function logout() {
    try {
        await Auth.signOut();
        publish("auth", { user: undefined });
    } catch (err) {
        console.log("Failed to logout", err);
    }
}

export type AuthEvent = {
    // state: AuthState
    user?: UserInfo
}

export type AuthCallback = (event: AuthEvent) => void

export function subscribeToUser(callback: AuthCallback) {
    const unsubscriber = subscribe("auth", callback);

    getUser().then(user => callback({ user }));

    return unsubscriber;
}