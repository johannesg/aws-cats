export type PubSubUnsubscriber = () => void

export type PubSubCallback = (event: any) => void

type Subscribers = {
    [key: string]: PubSubCallback[]
}
const subscribers: Subscribers = {}

export function publish(eventName: string, event: any) {
    if (!Array.isArray(subscribers[eventName]))
        return;

    console.log(`Publishing ${eventName} to ${subscribers[eventName].length} subscribers`)
    subscribers[eventName].forEach(cl => cl(event));
}

export function subscribe(eventName: string, callback: PubSubCallback) : PubSubUnsubscriber {
    if (!Array.isArray(subscribers[eventName]))
        subscribers[eventName] = [];

    //on subscribe we will we will push callback to subscribers[eventName] array
    subscribers[eventName].push(callback);
    const index = subscribers[eventName].length - 1

    console.log(`Subscribing to ${eventName}`)
    // subscribed callbacks to be removed when they are no longer necessary.
    return () => {
        subscribers[eventName].splice(index, 1);
    };
}
