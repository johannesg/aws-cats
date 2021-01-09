
import { Auth, CognitoUser } from '@aws-amplify/auth'
import { publish, PubSubCallback, PubSubUnsubscriber, subscribe } from './pubsub';

export async function getUser() {
    try {
        const user = await Auth.currentAuthenticatedUser();
        return user;
    } catch (_) {
        return undefined;
    }
}

export async function login(username: string, password: string) {
    try {
        const user = await Auth.signIn(username, password);
        publish("auth", user);
        console.log("User logged in", user);
    } catch (err) {
        console.log("Failed to login", err);
    }
}

export async function logout() {
    try {
        await Auth.signOut();
        publish("auth", null);
    } catch (err) {
        console.log("Failed to logout", err);
    }
}

export type AuthCallback = (event: CognitoUser) => void

export function subscribeToUserStateChanged(callback: AuthCallback) {
    return subscribe("auth", callback);
}