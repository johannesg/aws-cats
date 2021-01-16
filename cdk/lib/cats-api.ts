import * as cdk from '@aws-cdk/core';
import { RestApi, LambdaIntegration, CfnAuthorizer, AuthorizationType, DomainName, SecurityPolicy, EndpointType, Cors } from '@aws-cdk/aws-apigateway';
import { CatsAuthentication } from './cats-auth';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { IHostedZone, ARecord, RecordTarget } from '@aws-cdk/aws-route53';
import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import * as targets from '@aws-cdk/aws-route53-targets';
import * as s3 from '@aws-cdk/aws-s3';

export interface CatsApiProps {
    domainName: string
    auth: CatsAuthentication
    zone: IHostedZone
    certificate: ICertificate
    source: s3.Location
}

export class CatsApi extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, { domainName, auth, zone, certificate, source }: CatsApiProps) {
        super(scope, id);

        new cdk.CfnOutput(this, 'Site', { value: 'https://' + domainName });

        const api = new RestApi(this, "GraphQL", {
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS // this is also the default
            }
        })

        const authorizerId = new CfnAuthorizer(this, "Authorizer", {
            name: "cats-api-cognito-authorizer",
            identitySource: "method.request.header.Authorization",
            providerArns: [auth.userPool.userPoolArn],
            restApiId: api.restApiId,
            type: AuthorizationType.COGNITO
        }).ref;

        const sourceBucket = s3.Bucket.fromBucketName(this, 'LambdaSourceBucket', source.bucketName);

        const handler = new Function(this, 'ApolloHandler', {
            runtime: Runtime.NODEJS_12_X,
            code: Code.fromBucket(sourceBucket, source.objectKey),
            handler: 'index.handler',
            description: `Function generated on: ${new Date().toISOString()}`,
            environment: {
                NODE_OPTIONS: "--enable-source-maps"
            }
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