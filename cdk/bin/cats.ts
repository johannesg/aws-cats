#!/usr/bin/env node
import 'source-map-support/register';
import { App } from '@aws-cdk/core';
import { CatsStack } from '../lib/cats-stack';
import { CertStack } from '../lib/cert-stack';
import { CatsPipelineStack } from '../lib/pipeline-stack';

const app = new App();
// const certStack = new CertStack(app, 'CertStack', {
//     env: { 
//       account: process.env.CDK_DEFAULT_ACCOUNT, 
//       region: process.env.CDK_DEFAULT_REGION 
//   }});
// const catsStack = new CatsStack(app, 'CatsStack', {
//     env: { 
//       account: process.env.CDK_DEFAULT_ACCOUNT, 
//       region: process.env.CDK_DEFAULT_REGION 
//   }});

new CatsPipelineStack(app, 'CatsPipelineStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});