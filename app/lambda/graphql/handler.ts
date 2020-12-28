interface Identity {
    username: string
    claims: {
        email: string
    }
}

interface GraphQLInfo {
    fieldName: string,
    selectionSetList: Array<any>
    selectionSetGraphQL: string
    parentTypeName: string
    variables: Record<string, any>
}

interface AppSyncEvent {
    identity: Identity

    request: {
        headers: Record<string, string>
    },

    info: GraphQLInfo
}

async function resolveQuery(event: AppSyncEvent) {
    console.debug(event.info);
    switch (event.info.fieldName) {
        case "hello":
            return "Hello Asshole!";
        case "me": {
            return { id: event.identity.username, email: event.identity?.claims?.email ?? "" };
        }
        default:
            return "ERROR";
    }
}

export async function handler(event: AppSyncEvent) {

    switch (event.info.parentTypeName) {
        case "Query":
            return await resolveQuery(event);
        default:
            console.log(`Unknown type: ${event.info.parentTypeName}`);
            console.log(event.info);
            break;
    }

    return "ERROR";
}