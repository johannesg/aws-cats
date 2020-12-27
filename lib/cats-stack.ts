// import { HitCounter } from './hitcounter.mjs';
import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
// import { HitCounter } from './hitcounter.js';
import { CatsAuthentication } from './cats-auth';
import { CatsApi } from './cats-api';

export class CatsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps | undefined) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new s3.Bucket(this, 'cats', {
      versioned: true,
      // publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const catsHandler = new lambda.Function(this, 'CatsHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('app/lambda'),
      handler: 'index.handler'
    });

    new apigw.LambdaRestApi(this, 'CatsEndpoint', {
      handler: catsHandler
    });

    const auth = new CatsAuthentication(this, "Auth");

    const api = new CatsApi(this, "Api", { auth });

    // const hitCounter = new HitCounter(this, 'CatsHitCounter', {
    //   downstream: catsHandler
    // });

    // new apigw.LambdaRestApi(this, 'CatsEndpoint', {
    //   handler: hitCounter.handler
    // });
  }
}
