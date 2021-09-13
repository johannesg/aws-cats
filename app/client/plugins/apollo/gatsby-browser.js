import { configure } from '../../src/apollo/client';

export function onClientEntry(_, { baseUrl }) {
    configure({ baseUrl });
}
