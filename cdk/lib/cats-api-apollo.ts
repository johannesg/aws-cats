import * as cdk from '@aws-cdk/core';
import { RestApi, LambdaRestApi, LambdaIntegration, CfnAuthorizer, AuthorizationType } from '@aws-cdk/aws-apigateway';
import { CatsAuthentication } from './cats-auth';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';

export interface CatsApi2Props {
    auth: CatsAuthentication
}

export class CatsApiApollo extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props: CatsApi2Props) {
        super(scope, id);

        const handler = new Function(this, 'ApolloHandler', {
            runtime: Runtime.NODEJS_12_X,
            code: Code.fromAsset('../app/lambda/apollo'),
            handler: 'index.handler'
        });

        const api = new RestApi(this, "CatsApiApollo", {
            restApiName: "cats-api-apollo"
        })

        const auth = new CfnAuthorizer(this, "APIGatewayAuthorizer", {
            name: "cats-authorizer",
            identitySource: "method.request.header.Authorization",
            providerArns: [props.auth.userPool.userPoolArn],
            restApiId: api.restApiId,
            type: AuthorizationType.COGNITO
        });

        const integration = new LambdaIntegration(handler, {});
        const get = api.root.addMethod("GET", integration, {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: { authorizerId: auth.ref }
        });

        const post = api.root.addMethod("POST", integration, {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: { authorizerId: auth.ref }
        });
    }
}