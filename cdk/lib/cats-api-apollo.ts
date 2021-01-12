import * as cdk from '@aws-cdk/core';
import { RestApi, LambdaIntegration, CfnAuthorizer, AuthorizationType, DomainName, SecurityPolicy, EndpointType, Cors } from '@aws-cdk/aws-apigateway';
import { CatsAuthentication } from './cats-auth';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { IHostedZone, ARecord, RecordTarget } from '@aws-cdk/aws-route53';
import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import * as targets from '@aws-cdk/aws-route53-targets';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';

export interface CatsApi2Props {
    domainName: string
    auth: CatsAuthentication,
    zone: IHostedZone,
    certificate: ICertificate
}

export class CatsApiApollo extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, { domainName, auth, zone, certificate }: CatsApi2Props) {
        super(scope, id);

        new cdk.CfnOutput(this, 'Site', { value: 'https://' + domainName });

        const api = new RestApi(this, "CatsApiGraphQL", {
            restApiName: "cats-api-graphql",
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS // this is also the default
            }
        })

        const authorizerId = new CfnAuthorizer(this, "APIGatewayAuthorizer", {
            name: "cats-authorizer",
            identitySource: "method.request.header.Authorization",
            providerArns: [auth.userPool.userPoolArn],
            restApiId: api.restApiId,
            type: AuthorizationType.COGNITO
        }).ref;

        const handler = new NodejsFunction(this, 'ApolloHandler', {
            runtime: Runtime.NODEJS_12_X,
            entry: '../app/lambda/apollo/index.ts',
            // code: Code.fromAsset('../app/lambda/apollo'),
            handler: 'handler',
            // bundling: {
                // commandHooks: {
                //     afterBundling: () => ([]),
                //     beforeBundling: () => ["npm run generate --prefix "],
                //     beforeInstall: () => []
                // }

            // }
        });

        const integration = new LambdaIntegration(handler, {});

        const get = api.root.addMethod("GET", integration, {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: { authorizerId }
        });

        const post = api.root.addMethod("POST", integration, {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: { authorizerId }
        });


        const domain = new DomainName(this, 'custom-domain', {
            domainName,
            certificate: certificate,
            endpointType: EndpointType.EDGE, // default is REGIONAL
            securityPolicy: SecurityPolicy.TLS_1_2
        });

        domain.addBasePathMapping(api, { basePath: 'graphql' });

        new ARecord(this, 'CustomDomainAliasRecord', {
            recordName: domainName,
            zone,
            target: RecordTarget.fromAlias(new targets.ApiGatewayDomain(domain))
        });
    }
}