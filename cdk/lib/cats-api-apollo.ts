import * as cdk from '@aws-cdk/core';
import { RestApi, LambdaIntegration, CfnAuthorizer, AuthorizationType, DomainName, SecurityPolicy, EndpointType } from '@aws-cdk/aws-apigateway';
import { CatsAuthentication } from './cats-auth';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { IHostedZone, ARecord, RecordTarget } from '@aws-cdk/aws-route53';
import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import * as targets from '@aws-cdk/aws-route53-targets';

export interface CatsApi2Props {
    domainName: string
    auth: CatsAuthentication,
    zone: IHostedZone,
    certificate: ICertificate
}

export class CatsApiApollo extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, { domainName, auth, zone, certificate }: CatsApi2Props) {
        super(scope, id);

        const api = new RestApi(this, "CatsApiGraphQL", {
            restApiName: "cats-api-graphql"
        })

        const authorizerId = new CfnAuthorizer(this, "APIGatewayAuthorizer", {
            name: "cats-authorizer",
            identitySource: "method.request.header.Authorization",
            providerArns: [auth.userPool.userPoolArn],
            restApiId: api.restApiId,
            type: AuthorizationType.COGNITO
        }).ref;

        const handler = new Function(this, 'ApolloHandler', {
            runtime: Runtime.NODEJS_12_X,
            code: Code.fromAsset('../app/lambda/apollo'),
            handler: 'index.handler'
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