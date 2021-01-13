import { CatsStack } from './cats-stack';
import { Stage, Construct, StageProps, Stack, StackProps } from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { Repository } from '@aws-cdk/aws-codecommit';
import { Artifact } from '@aws-cdk/aws-codepipeline';

// type CatsBuildStackProps = StackProps & {
//     source: Artifact
// }


// type CatsPipelineBuildStageProps = StageProps & {
//     source: Artifact
// }
// export class CatsPipelineBuildStage extends Stage {
//     constructor(scope: Construct, id: string, props: CatsPipelineBuildStageProps) {
//         super(scope, id, props);

//         new CatsBuildStack(this, 'CatsBuildStack', props);
//     }
// }

class EmptyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
  }
}

export class CatsPipelineDeployStage extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        new EmptyStack(this, 'EmptyStack', {});

        // new CatsStack(this, 'CatsStack', {
        //     env: {
        //         account: process.env.CDK_DEFAULT_ACCOUNT,
        //         region: process.env.CDK_DEFAULT_REGION
        //     }
        // });
    }
}