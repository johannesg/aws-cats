import jwt_decode from 'jwt-decode'

interface AppSyncEvent {
    identity: {
        username: string
    }

    request: {
        headers: Record<string, string>
    },

    info: {
        fieldName: string,
        selectionSetList: Array<any>,
        selectionSetGraphQL: string,
        parentTypeName: string,
        variables: Record<string, any>
    }
}

async function resolveQuery(event: AppSyncEvent) {
    switch (event.info.fieldName) {
        case "hello":
            return "Hello Asshole!";
        case "me": {
            const token = jwt_decode(event.request.headers.authorization);

            return { id: event.identity.username, email: "" };
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

    // return {
    //     statusCode: 200,
    //     headers: { "Content-Type": "application/json"},
    //     body: "World" 
    // };
}