import * as cdk from '@aws-cdk/core';
import * as gw2 from '@aws-cdk/aws-apigatewayv2';
import * as gw2i from '@aws-cdk/aws-apigatewayv2-integrations';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { IHostedZone, ARecord, RecordTarget } from '@aws-cdk/aws-route53';
import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import * as targets from '@aws-cdk/aws-route53-targets';
import * as s3 from '@aws-cdk/aws-s3';
import { CfnOutput, Duration, Fn, Stack } from '@aws-cdk/core';
import { ITable } from '@aws-cdk/aws-dynamodb';

export interface CatsApiProps {
    domainName: string
    zone: IHostedZone
    certificate: ICertificate
    source: s3.Location
    table: ITable,
    envName: string
}

export class CatsApi extends cdk.Construct {
    public readonly handler : Function;

    constructor(scope: cdk.Construct, id: string, { domainName, zone, certificate, source, table, envName }: CatsApiProps) {
        super(scope, id);

        new cdk.CfnOutput(this, 'Site', { value: 'https://' + domainName });

        const userPoolId = Fn.importValue("cats-user-pool-id");
        const userPoolClientId = Fn.importValue("cats-user-pool-clientid");

        const sourceBucket = s3.Bucket.fromBucketName(this, 'LambdaSourceBucket', source.bucketName);

        this.handler = new Function(this, 'ApolloHandler', {
            runtime: Runtime.NODEJS_12_X,
            code: Code.fromBucket(sourceBucket, source.objectKey),
            handler: 'index.handler',
            description: `Function generated on: ${new Date().toISOString()}`,
            environment: {
                NODE_OPTIONS: "--enable-source-maps",
                DYNAMODB_TABLENAME: table.tableName,
                ENV_NAME: envName
            },
            timeout: Duration.seconds(30),
            memorySize: 512
        });

        table.grantReadWriteData(this.handler);

        // HttpApi
        const domain = new gw2.DomainName(this, 'DomainName', {
            domainName,
            certificate
          });

        const httpApi = new gw2.HttpApi(this, 'HttpProxyApi', {
            corsPreflight: {
                allowHeaders: ['Authorization','Content-Type'],
                allowMethods: [gw2.CorsHttpMethod.GET, gw2.CorsHttpMethod.HEAD, gw2.CorsHttpMethod.OPTIONS, gw2.CorsHttpMethod.POST],
                allowOrigins: ['*'],
                maxAge: Duration.days(10),
            },
            defaultDomainMapping: {
                domainName: domain,
              },
        });

        new CfnOutput(this, "HttpApiEndpoint", { value: httpApi.apiEndpoint });
        const authorizer2 = this.addAuthorizer(this, httpApi, userPoolId, userPoolClientId)

        const routes = httpApi.addRoutes({
            path: "/graphql",
            methods: [gw2.HttpMethod.GET, gw2.HttpMethod.POST],
            integration: new gw2i.LambdaProxyIntegration({
                handler: this.handler,
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
            target: RecordTarget.fromAlias(new targets.ApiGatewayv2DomainProperties(domain.regionalDomainName, domain.regionalHostedZoneId))
        });
    }

    private addAuthorizer(
        stack: cdk.Construct,
        httpApi: gw2.HttpApi,
        userPoolId: string,
        userPoolClientId: string,
    ): gw2.CfnAuthorizer {
        const region = Stack.of(this).region;
        return new gw2.CfnAuthorizer(stack, 'CognitoAuthorizer', {
            name: 'CognitoAuthorizer',
            identitySource: ['$request.header.Authorization'],
            apiId: httpApi.httpApiId,
            authorizerType: 'JWT',
            jwtConfiguration: {
                audience: [userPoolClientId],
                issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
            },
        });
    }
}