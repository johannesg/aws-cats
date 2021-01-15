import { Stack, Construct, StackProps } from '@aws-cdk/core';
import { Repository } from '@aws-cdk/aws-codecommit';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';

type CatsPipelineStackProps = StackProps & {
}

export class CatsPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props: CatsPipelineStackProps) {
        super(scope, id, props);

        // Creates a CodeCommit repository called 'WorkshopRepo'
        const repo = new Repository(this, 'CatsRepo', {
            repositoryName: "Cats"
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

        const sourceAction = new codepipeline_actions.CodeCommitSourceAction({
            actionName: 'CodeCommit', // Any Git-based source control
            output: sourceOutput, // Indicates where the artifact is stored
            repository: repo // Designates the repo to draw code from
        })
        const lambdaBuildAction = new codepipeline_actions.CodeBuildAction({
            actionName: 'Lambda_Build',
            project: lambdaBuild,
            input: sourceOutput,
            outputs: [lambdaBuildOutput],
        });
        const appBuildAction = new codepipeline_actions.CodeBuildAction({
            actionName: 'App_Build',
            project: appBuild,
            input: sourceOutput,
            outputs: [appBuildOutput],
        });
        const cdkBuildAction = new codepipeline_actions.CodeBuildAction({
            actionName: 'CDK_Build',
            project: cdkBuild,
            input: sourceOutput,
            outputs: [cdkBuildOutput],
        });

        const deployAction = new codepipeline_actions.CloudFormationCreateUpdateStackAction({
            actionName: 'Cats_CFN_Deploy',
            templatePath: cdkBuildOutput.atPath('CatsStack.template.json'),
            stackName: 'CatsStack',
            adminPermissions: true,
            parameterOverrides: {
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
        });

        // Complete Pipeline Project
        const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
            restartExecutionOnUpdate: true,
            crossAccountKeys: false,
            stages: [
                {
                    stageName: 'Source',
                    actions: [sourceAction]
                },
                {
                    stageName: 'Build',
                    actions: [lambdaBuildAction, appBuildAction, cdkBuildAction]
                },
                {
                    stageName: 'Deploy',
                    actions: [deployAction]
                },
            ],
        });

        pipeline.artifactBucket.grantRead(deployAction.deploymentRole);
    }
}