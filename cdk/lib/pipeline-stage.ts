import { CatsStack } from './cats-stack';
import { Stage, Construct, StageProps, Stack, StackProps } from '@aws-cdk/core';
import { Artifact } from '@aws-cdk/aws-codepipeline';

class EmptyStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);
    }
}

type CatsPipelineStageProps = StageProps & {
    appArtifact: Artifact,
    lambdaArtifact: Artifact
}

export class CatsPipelineStage extends Stage {
    constructor(scope: Construct, id: string, props: CatsPipelineStageProps) {
        super(scope, id, props);

        new CatsStack(this, 'CatsStack', {
            env: {
                account: process.env.CDK_DEFAULT_ACCOUNT,
                region: process.env.CDK_DEFAULT_REGION
            },
            sources: {
                app: props.appArtifact.s3Location,
                lambda: props.lambdaArtifact.s3Location
            }
        });
    }
}