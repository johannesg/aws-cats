#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CatsStack } from '../lib/cats-stack';
// const { CatsStack }  = require('../lib/cats-stack.js');

const app = new cdk.App();
new CatsStack(app, 'CatsStack', undefined);
