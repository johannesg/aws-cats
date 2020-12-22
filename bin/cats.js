#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CatsStack } = require('../lib/cats-stack');

const app = new cdk.App();
new CatsStack(app, 'CatsStack');
