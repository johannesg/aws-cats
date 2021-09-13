#!/usr/bin/env node
import 'source-map-support/register';
import { App } from '@aws-cdk/core';
import { CatsStack } from '../lib/cats-stack';
import { CatsPipelineStack } from '../lib/pipeline-stack';
import { CatsResourcesStack } from '../lib/cats-resources-stack';


const env = { account: '700595718361', region: 'eu-north-1' };

const app = new App();
// const certStack = new CertStack(app, 'CertStack', {
//     env: { 
//       account: process.env.CDK_DEFAULT_ACCOUNT, 
//       region: process.env.CDK_DEFAULT_REGION 
//   }});

const cats = new CatsStack(app, 'CatsStack', {
    env
});

new CatsPipelineStack(app, 'CatsPipelineStack', {
    cats,
    env
});

new CatsResourcesStack(app, 'CatsResourcesStack', {
    env
});