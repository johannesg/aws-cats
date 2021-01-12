import { CatsStack } from './cats-stack';
import { Stage, Construct, StageProps } from '@aws-cdk/core';

export class CatsPipelineStage extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        new CatsStack(this, 'CatsStack', {
            env: {
                account: process.env.CDK_DEFAULT_ACCOUNT,
                region: process.env.CDK_DEFAULT_REGION
            }
        });
    }
}