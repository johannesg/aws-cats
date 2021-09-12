import { Construct, Stage, Stack, StackProps, StageProps } from '@aws-cdk/core';
import { CodeBuildStep, CodePipeline, CodePipelineSource, ShellStep } from '@aws-cdk/pipelines';
import { CatsStack } from './cats-stack';
import * as codebuild from '@aws-cdk/aws-codebuild';

export class CatsPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const input = CodePipelineSource.connection('johannesg/aws-cats', 'master', {
            connectionArn: 'arn:aws:codestar-connections:eu-north-1:700595718361:connection/32191430-b2de-481b-b292-0c24114045da', // Created using the AWS console * });',
        })

        const appBuild = new CodeBuildStep('AppBuild', {
            input,
            installCommands: [
                'npm cd app/client',
                'npm install -g npm',
                'npm ci'
            ],
            primaryOutputDirectory: 'app/client/build',
            commands: ['npm run build'],
            buildEnvironment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
            }
        });

        const lambdaBuild = new CodeBuildStep('LambdaBuild', {
            input,
            installCommands: [
                'npm cd app/lambda',
                'npm install -g npm',
                'npm ci'
            ],
            primaryOutputDirectory: 'app/lambda/build',
            commands: ['npm run build'],
            buildEnvironment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
            }, 
        });

        const pipeline = new CodePipeline(this, 'Pipeline', {
            synth: new ShellStep('Synth', {
                // Use a connection created using the AWS console to authenticate to GitHub
                // Other sources are available.
                input: CodePipelineSource.connection('johannesg/aws-cats', 'master', {
                    connectionArn: 'arn:aws:codestar-connections:eu-north-1:700595718361:connection/32191430-b2de-481b-b292-0c24114045da', // Created using the AWS console * });',
                }),
                installCommands: [
                    'cd cdk',
                    'npm install -g npm',
                    'npm ci',
                ],
                commands: [
                    'npm run build',
                    'npx cdk synth',
                ],
                primaryOutputDirectory: 'cdk/cdk.out',
                additionalInputs: {
                    "out_client": appBuild,
                    "out_lambda": lambdaBuild
                 } 
            }),
        });

        // 'MyApplication' is defined below. Call `addStage` as many times as
        // necessary with any account and region (may be different from the
        // pipeline's).
        pipeline.addStage(new CatsApplicaton(this, 'Prod', {
            env: props?.env
            // env: {
            //   account: '123456789012',
            //   region: 'eu-west-1',
            // }
        }));
    }
}

class CatsApplicaton extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        new CatsStack(this, 'CatsStack', {
            env: props?.env
        });
    }
}