
import { Auth } from '@aws-amplify/auth'

const credentials = Auth.Credentials;

const session = Auth.currentAuthenticatedUser();

export async function getUser() {
    const user = await Auth.currentAuthenticatedUser();

    return user;
}

type Unsubscriber = () => void

type Callback = (event: any) => Unsubscriber

type Subscribers = {
    [key: string]: Callback[]
}
const subscribers: Subscribers = {}

function publish(eventName: string, event: any) {
    if (!Array.isArray(subscribers[eventName]))
        return;

    subscribers[eventName].forEach(cl => cl(event));
}

function subscribe(eventName: string, callback: Callback) {
    if (!Array.isArray(subscribers[eventName]))
        subscribers[eventName] = [];

    //on subscribe we will we will push callback to subscribers[eventName] array
    subscribers[eventName].push(callback);
    const index = subscribers[eventName].length - 1

    // subscribed callbacks to be removed when they are no longer necessary.
    return () => {
        subscribers[eventName].splice(index, 1);
    };
}

export function subscribeToUserStateChanged(callback: Callback) {


}