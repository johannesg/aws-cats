import * as cdk from '@aws-cdk/core';
// import { RestApi, LambdaIntegration, CfnAuthorizer, AuthorizationType, DomainName, SecurityPolicy, EndpointType, Cors } from '@aws-cdk/aws-apigateway';
import * as gw2 from '@aws-cdk/aws-apigatewayv2';
import * as gw2i from '@aws-cdk/aws-apigatewayv2-integrations';
import { CatsAuthentication } from './cats-auth';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { IHostedZone, ARecord, RecordTarget } from '@aws-cdk/aws-route53';
import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import * as targets from '@aws-cdk/aws-route53-targets';
import * as s3 from '@aws-cdk/aws-s3';
import { IUserPool, IUserPoolClient } from '@aws-cdk/aws-cognito';
import { CfnOutput, Duration, Stack } from '@aws-cdk/core';

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

        // const integration = new LambdaIntegration(handler, {});

        // const api = new RestApi(this, "GraphQL", {
        //     defaultCorsPreflightOptions: {
        //         allowOrigins: Cors.ALL_ORIGINS,
        //         allowMethods: Cors.ALL_METHODS // this is also the default
        //     }
        // })

        // const authorizerId = new CfnAuthorizer(this, "Authorizer", {
        //     name: "cats-api-cognito-authorizer",
        //     identitySource: "method.request.header.Authorization",
        //     providerArns: [auth.userPool.userPoolArn],
        //     restApiId: api.restApiId,
        //     type: AuthorizationType.COGNITO
        // }).ref;
        // const get = api.root.addMethod("GET", integration, {
        //     authorizationType: AuthorizationType.COGNITO,
        //     authorizer: { authorizerId }
        // });

        // const post = api.root.addMethod("POST", integration, {
        //     authorizationType: AuthorizationType.COGNITO,
        //     authorizer: { authorizerId }
        // });

        // const domain = new DomainName(this, 'CustomDomain', {
        //     domainName,
        //     certificate: certificate,
        //     endpointType: EndpointType.EDGE, // default is REGIONAL
        //     securityPolicy: SecurityPolicy.TLS_1_2
        // });

        // domain.addBasePathMapping(api, { basePath: 'graphql' });

        // HttpApi
        const domain = new gw2.DomainName(this, 'DomainName', {
            domainName,
            certificate
          });

        const httpApi = new gw2.HttpApi(this, 'HttpProxyApi', {
            corsPreflight: {
                allowHeaders: ['Authorization','Content-Type'],
                allowMethods: [gw2.HttpMethod.GET, gw2.HttpMethod.HEAD, gw2.HttpMethod.OPTIONS, gw2.HttpMethod.POST],
                allowOrigins: ['*'],
                maxAge: Duration.days(10),
            },
            defaultDomainMapping: {
                domainName: domain,
              },
        });

        new CfnOutput(this, "HttpApiEndpoint", { value: httpApi.apiEndpoint });
        const authorizer2 = this.addAuthorizer(this, httpApi, auth.userPool, auth.userPoolClient)

        const routes = httpApi.addRoutes({
            path: "/graphql",
            methods: [gw2.HttpMethod.GET, gw2.HttpMethod.POST],
            integration: new gw2i.LambdaProxyIntegration({
                handler,
                payloadFormatVersion: gw2.PayloadFormatVersion.VERSION_1_0
            })
        });

        // https://dev.to/martzcodes/token-authorizers-with-apigatewayv2-tricks-apigwv1-doesn-t-want-you-to-know-41jn
        routes.forEach((route) => {
            const routeCfn = route.node.defaultChild as gw2.CfnRoute;
            routeCfn.authorizerId = authorizer2.ref;
            routeCfn.authorizationType = "JWT"; // THIS HAS TO MATCH THE AUTHORIZER TYPE ABOVE
        });

        new ARecord(this, 'DomainAliasRecord', {
            recordName: domainName,
            zone,
            target: RecordTarget.fromAlias(new targets.ApiGatewayv2Domain(domain))
        });
    }

    private addAuthorizer(
        stack: cdk.Construct,
        httpApi: gw2.HttpApi,
        userPool: IUserPool,
        userPoolClient: IUserPoolClient,
    ): gw2.CfnAuthorizer {
        const region = Stack.of(this).region;
        return new gw2.CfnAuthorizer(stack, 'CognitoAuthorizer', {
            name: 'CognitoAuthorizer',
            identitySource: ['$request.header.Authorization'],
            apiId: httpApi.httpApiId,
            authorizerType: 'JWT',
            jwtConfiguration: {
                audience: [userPoolClient.userPoolClientId],
                issuer: `https://cognito-idp.${region}.amazonaws.com/${userPool.userPoolId}`,
            },
        });
    }
}