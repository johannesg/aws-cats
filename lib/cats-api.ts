import * as cdk from '@aws-cdk/core';
import { AuthorizationType, GraphqlApi, Schema } from '@aws-cdk/aws-appsync'
import { CatsAuthentication } from './cats-auth';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';

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
            },
            schema: Schema.fromAsset("app/schema.graphql")
        });

        const graphqlHandler = new Function(this, 'GraphQLHandler', {
            runtime: Runtime.NODEJS_12_X,
            code: Code.fromAsset('app/lambda'),
            handler: 'graphqlLambda.handler'
        });

        const lambdaDS = api.addLambdaDataSource("graphql", graphqlHandler);
        lambdaDS.createResolver({typeName: "Query", fieldName: "hello"})

        new cdk.CfnOutput(this, "GraphQLAPIURL", { value: api.graphqlUrl });
    }
}