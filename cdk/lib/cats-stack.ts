import * as cdk from '@aws-cdk/core';
import { HostedZone } from '@aws-cdk/aws-route53';
import { CatsAuthentication } from './cats-auth';
import { CatsApi } from './cats-api';
import { CatsApiApollo } from './cats-api-apollo';
import { StaticSite } from './static-site';
import { ICertificate } from '@aws-cdk/aws-certificatemanager';

export interface CatsStackProps extends cdk.StackProps {
  certificate: ICertificate
}


export class CatsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: CatsStackProps) {
    super(scope, id, props);

    const { certificate } = props;

    // The code that defines your stack goes here
    // new s3.Bucket(this, 'cats', {
    //   versioned: true,
    //   // publicReadAccess: true,
    //   removalPolicy: cdk.RemovalPolicy.DESTROY
    // });

    // const catsHandler = new lambda.Function(this, 'CatsHandler', {
    //   runtime: lambda.Runtime.NODEJS_12_X,
    //   code: lambda.Code.fromAsset('app/lambda'),
    //   handler: 'index.handler'
    // });

    // new apigw.LambdaRestApi(this, 'CatsEndpoint', {
    //   handler: catsHandler
    // });

    const zone = HostedZone.fromLookup(this, 'Zone', { domainName: "aws.jogus.io" });

    const auth = new CatsAuthentication(this, "Auth");

    // const appsync = new CatsApi(this, "Api", { auth });

    const api = new CatsApiApollo(this, "ApiApollo", {
      domainName: "catsapi.aws.jogus.io",
      auth, 
      zone, 
      certificate
    });

    const site = new StaticSite(this, "ClientSite", {
      domainName: "cats.aws.jogus.io",
      source: "../app/client/public",
      zone,
      certificate
    });

    // const hitCounter = new HitCounter(this, 'CatsHitCounter', {
    //   downstream: catsHandler
    // });

    // new apigw.LambdaRestApi(this, 'CatsEndpoint', {
    //   handler: hitCounter.handler
    // });
  }
}
