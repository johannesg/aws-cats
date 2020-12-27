import * as cdk from '@aws-cdk/core';
import { AuthorizationType, GraphqlApi } from '@aws-cdk/aws-appsync'
import { CatsAuthentication } from './cats-auth';

export interface CatsApiProps {
    auth: CatsAuthentication
}

export class CatsApi extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props: CatsApiProps) {
        super(scope, id);

        const api = new GraphqlApi(this, "CatsApi", {
            name: "cats-api",
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: AuthorizationType.USER_POOL,
                    userPoolConfig: { userPool: props.auth.userPool }
                }
            }
        });

        new cdk.CfnOutput(this, "GraphQLAPIURL", { value: api.graphqlUrl });
    }
}