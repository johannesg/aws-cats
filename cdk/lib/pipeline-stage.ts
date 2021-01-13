import { CatsStack } from './cats-stack';
import { Stage, Construct, StageProps, Stack, StackProps } from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { Repository } from '@aws-cdk/aws-codecommit';
import { Artifact } from '@aws-cdk/aws-codepipeline';

type CatsBuildStackProps = StackProps & {
    source: Artifact
}

export class CatsBuildStack extends Stack {
    constructor(scope: Construct, id: string, props: CatsBuildStackProps) {
        super(scope, id, props);

        const lambdaBuild = new codebuild.PipelineProject(this, 'LambdaBuild', {
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    install: {
                        commands: [
                            'cd app/lambda/apollo',
                            'npm install',
                        ],
                    },
                    build: {
                        commands: 'npm run build',
                    },
                },
                artifacts: {
                    'base-directory': 'app/lambda/apollo',
                    files: [
                        'index.js',
                        'node_modules/**/*',
                    ],
                },
            }),
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
            },
        });


        const lambdaBuildOutput = new codepipeline.Artifact('LambdaBuildOutput');

        new codepipeline_actions.CodeBuildAction({
            actionName: 'Lambda_Build',
            project: lambdaBuild,
            input: props.source,
            outputs: [lambdaBuildOutput],
        });
    }
}

type CatsPipelineBuildStageProps = StageProps & {
    source: Artifact
}
export class CatsPipelineBuildStage extends Stage {
    constructor(scope: Construct, id: string, props: CatsPipelineBuildStageProps) {
        super(scope, id, props);

        new CatsBuildStack(this, 'CatsBuildStack', props);
    }
}

export class CatsPipelineDeployStage extends Stage {
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