import * as cdk from '@aws-cdk/core';
import { HostedZone } from '@aws-cdk/aws-route53';
import { CatsAuthentication } from './cats-auth';
import { CatsApiApollo } from './cats-api-apollo';
import { StaticSite } from './static-site';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import * as s3 from '@aws-cdk/aws-s3';
import { Repository } from '@aws-cdk/aws-codecommit';
import * as lambda from '@aws-cdk/aws-lambda';
import { CfnParameter } from '@aws-cdk/core';

export interface CatsStackProps extends cdk.StackProps {
  // certificate: ICertificate
  // sources: {
  //   app: s3.Location,
  //   lambda: s3.Location
  // }
}


export class CatsStack extends cdk.Stack {
  // public readonly lambdaCode: lambda.CfnParametersCode;
  public readonly lambdaCodeBucketName: CfnParameter;
  public readonly lambdaCodeObjectKey: CfnParameter;
  public readonly appCodeBucketName: CfnParameter;
  public readonly appCodeObjectKey: CfnParameter;

  constructor(scope: cdk.Construct, id: string, props: CatsStackProps) {
    super(scope, id, props);

    this.lambdaCodeBucketName = new CfnParameter(this, "lambdaCodeBucketName");
    this.lambdaCodeObjectKey = new CfnParameter(this, "lambdaCodeObjectKey");
    this.appCodeBucketName = new CfnParameter(this, "appCodeBucketName");
    this.appCodeObjectKey = new CfnParameter(this, "appCodeObjectKey");

    new cdk.CfnOutput(this, 'LambdaCodeBucketName', { value: this.lambdaCodeBucketName.valueAsString });
    new cdk.CfnOutput(this, 'LambdaCodeObjectKey', { value: this.lambdaCodeObjectKey.valueAsString });
    new cdk.CfnOutput(this, 'AppCodeBucketName', { value: this.appCodeBucketName.valueAsString });
    new cdk.CfnOutput(this, 'AppCodeObjectKey', { value: this.appCodeObjectKey.valueAsString });

    const certificate = Certificate.fromCertificateArn(this, "CatsCert", "arn:aws:acm:us-east-1:700595718361:certificate/37ff910c-28e1-4e64-b77f-806eef9d1ff0");

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

    const repo = Repository.fromRepositoryName(this, "CatsRepo", "CatsRepo");

    // const appsync = new CatsApi(this, "Api", { auth });

    const api = new CatsApiApollo(this, "ApiApollo", {
      domainName: "catsapi.aws.jogus.io",
      auth,
      zone,
      certificate,
      source: {
        bucketName: this.lambdaCodeBucketName.valueAsString,
        objectKey: this.lambdaCodeObjectKey.valueAsString
      }
    });

    const site = new StaticSite(this, "AppSite", {
      domainName: "cats.aws.jogus.io",
      zone,
      certificate,
      source: {
        bucketName: this.appCodeBucketName.valueAsString,
        objectKey: this.appCodeObjectKey.valueAsString
      }
    });

    // const hitCounter = new HitCounter(this, 'CatsHitCounter', {
    //   downstream: catsHandler
    // });

    // new apigw.LambdaRestApi(this, 'CatsEndpoint', {
    //   handler: hitCounter.handler
    // });
  }
}
