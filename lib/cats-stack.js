// import { HitCounter } from './hitcounter.mjs';
const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');
const lambda = require('@aws-cdk/aws-lambda');
const apigw = require('@aws-cdk/aws-apigateway');
const { HitCounter } = require('./hitcounter.js');

class CatsStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new s3.Bucket(this, 'cats', {
      versioned: true,
      // publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const catsHandler = new lambda.Function(this, 'CatsHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler'
    });

    console.log(HitCounter);

    const hitCounter = new HitCounter(this, 'CatsHitCounter', {
      downstream: catsHandler
    });

    new apigw.LambdaRestApi(this, 'CatsEndpoint', {
      handler: hitCounter.handler
    });
  }
}

module.exports = { CatsStack }
