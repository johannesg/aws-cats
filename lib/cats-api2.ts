import * as cdk from '@aws-cdk/core';
import { RestApi, LambdaRestApi, LambdaIntegration, CfnAuthorizer, AuthorizationType } from '@aws-cdk/aws-apigateway';
import { CatsAuthentication } from './cats-auth';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';

export interface CatsApi2Props {
    auth: CatsAuthentication
}

export class CatsApi2 extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props: CatsApi2Props) {
        super(scope, id);


        const handler = new Function(this, 'GraphQL2Handler', {
            runtime: Runtime.NODEJS_12_X,
            code: Code.fromAsset('app/lambda'),
            handler: 'index.handler'
        });

        const api = new RestApi(this, "CatsApi2", {
            restApiName: "cats-api-2"
        })
        // const auth = new CfnAuthorizer(this, "APIGatewayAuthorizer", {
        //     name: "cats-authorizer",
        //     identitySource: "method.request.header.Authorization",
        //     providerArns: [props.auth.userPool.userPoolArn],
        //     restApiId: api.restApiId,
        //     type: AuthorizationType.COGNITO
        // });

        const getIntegration = new LambdaIntegration(handler, {});
        const get = api.root.addMethod("GET", getIntegration, {
            // authorizationType: AuthorizationType.COGNITO,
            // authorizationType: AuthorizationType.NONE
            // authorizer: { authorizerId: auth.ref }
        });
        new LambdaRestApi(this, 'CatsEndpoint', {
            handler: handler
        });

    }
}