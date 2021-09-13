#!/usr/bin/env node
import 'source-map-support/register';
import { App } from '@aws-cdk/core';
import { CatsStack } from '../lib/cats-stack';
import { CatsPipelineStack } from '../lib/pipeline-stack';
import { CatsResourcesStack } from '../lib/cats-resources-stack';

const env = { account: '700595718361', region: 'eu-north-1' };
const app = new App();

const cats = new CatsStack(app, 'CatsStack', {
    env,
    envName: "PROD"
});

const catsDev = new CatsStack(app, 'CatsStackDev', {
    env,
    envName: "DEV"
});

new CatsPipelineStack(app, 'CatsPipelineStack', {
    env,
    stack: cats,
    gitBranch: "master"
});

new CatsPipelineStack(app, 'CatsPipelineStackDev', {
    env,
    stack: catsDev,
    gitBranch: "dev"
});

new CatsResourcesStack(app, 'CatsResourcesStack', {
    env
});