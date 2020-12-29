interface Identity {
    username: string;
    claims: {
        email: string;
    };
}
interface GraphQLInfo {
    fieldName: string;
    selectionSetList: Array<any>;
    selectionSetGraphQL: string;
    parentTypeName: string;
    variables: Record<string, any>;
}
interface AppSyncEvent {
    identity: Identity;
    request: {
        headers: Record<string, string>;
    };
    info: GraphQLInfo;
    arguments: Record<string, any>;
}
export declare function handler(event: AppSyncEvent): Promise<"Hello Asshole!" | "ERROR" | {
    id: string;
    email: string;
}>;
export {};
