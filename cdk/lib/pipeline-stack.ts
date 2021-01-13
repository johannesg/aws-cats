import { Stack, Construct, StackProps, CfnParameter } from '@aws-cdk/core';
import { Repository } from '@aws-cdk/aws-codecommit';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
// import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';
// import { CatsPipelineStage } from './pipeline-stage';
import * as lambda from '@aws-cdk/aws-lambda';

type CatsPipelineStackProps = StackProps & {
    // lambdaCode: lambda.CfnParametersCode
    // appCode: {
    //     bucketName: CfnParameter
    //     objectKey: CfnParameter
    // }
}

export class CatsPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props: CatsPipelineStackProps) {
        super(scope, id, props);

        // Creates a CodeCommit repository called 'WorkshopRepo'
        const repo = new Repository(this, 'CatsRepo', {
            repositoryName: "CatsRepo"
        });

        const cdkBuild = new codebuild.PipelineProject(this, 'CdkBuild', {
            buildSpec: codebuild.BuildSpec.fromSourceFilename("ci/build-cdk.yml"),
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_4_0,
            }
        });

        const lambdaBuild = new codebuild.PipelineProject(this, 'LambdaBuild', {
            buildSpec: codebuild.BuildSpec.fromSourceFilename("ci/build-api.yml"),
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_4_0,
            },
        });

        const appBuild = new codebuild.PipelineProject(this, 'AppBuild', {
            buildSpec: codebuild.BuildSpec.fromSourceFilename("ci/build-app.yml"),
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_4_0,
            },
        });

        // Create Artifacts
        const sourceOutput = new codepipeline.Artifact("SrcOutput");
        const cdkBuildOutput = new codepipeline.Artifact('CdkBuildOutput');
        const lambdaBuildOutput = new codepipeline.Artifact('LambdaBuildOutput');
        const appBuildOutput = new codepipeline.Artifact('AppBuildOutput');


        // Complete Pipeline Project
        new codepipeline.Pipeline(this, 'Pipeline', {
            restartExecutionOnUpdate: true,
            stages: [
                {
                    stageName: 'Source',
                    actions: [
                        new codepipeline_actions.CodeCommitSourceAction({
                            actionName: 'CodeCommit', // Any Git-based source control
                            output: sourceOutput, // Indicates where the artifact is stored
                            repository: repo // Designates the repo to draw code from
                        })],
                },
                {
                    stageName: 'Build',
                    actions: [
                        new codepipeline_actions.CodeBuildAction({
                            actionName: 'Lambda_Build',
                            project: lambdaBuild,
                            input: sourceOutput,
                            outputs: [lambdaBuildOutput],
                        }),
                        new codepipeline_actions.CodeBuildAction({
                            actionName: 'App_Build',
                            project: appBuild,
                            input: sourceOutput,
                            outputs: [appBuildOutput],
                        }),
                        new codepipeline_actions.CodeBuildAction({
                            actionName: 'CDK_Build',
                            project: cdkBuild,
                            input: sourceOutput,
                            outputs: [cdkBuildOutput],
                        }),
                    ],
                },
                {
                    stageName: 'Deploy',
                    actions: [
                        new codepipeline_actions.CloudFormationCreateUpdateStackAction({
                            actionName: 'Cats_CFN_Deploy',
                            templatePath: cdkBuildOutput.atPath('CatsStack.template.json'),
                            stackName: 'CatsDeploymentStack',
                            adminPermissions: true,
                            parameterOverrides: {
                                // ...props.lambdaCode.assign(lambdaBuildOutput.s3Location),
                                ... {
                                    lambdaCodeBucketName: lambdaBuildOutput.s3Location.bucketName,
                                    lambdaCodeObjectKey: lambdaBuildOutput.s3Location.objectKey
                                },
                                ...{
                                    appCodeBucketName: appBuildOutput.s3Location.bucketName,
                                    appCodeObjectKey: appBuildOutput.s3Location.objectKey
                                }
                            },
                            extraInputs: [lambdaBuildOutput, appBuildOutput],
                        }),
                    ],
                },
            ],
        });
    }
}