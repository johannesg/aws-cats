import { Stack, Construct, StackProps, Fn } from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { CatsStack } from './cats-stack';

type CatsPipelineStackProps = StackProps & {
    cats: CatsStack,
    gitBranch: string
}

export class CatsPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props: CatsPipelineStackProps) {
        super(scope, id, props);

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

        const userPoolId = Fn.importValue("cats-user-pool-id");
        const userPoolClientId = Fn.importValue("cats-user-pool-clientid");

        const appBuild = new codebuild.PipelineProject(this, 'AppBuild', {
            buildSpec: codebuild.BuildSpec.fromSourceFilename("ci/build-app.yml"),
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_4_0,
            },
            environmentVariables: {
                "AWS_REGION": { value:  props!.env!.region},
                "AWS_USER_POOL_ID": { value:  userPoolId},
                "AWS_USER_POOL_CLIENTID": { value:  userPoolClientId},
                "APOLLO_BASEURL": { value:  `https://${props.cats.apiDomain}/graphql` },
            }
        });

        // Create Artifacts
        const sourceOutput = new codepipeline.Artifact("SrcOutput");
        const cdkBuildOutput = new codepipeline.Artifact('CdkBuildOutput');
        const lambdaBuildOutput = new codepipeline.Artifact('LambdaBuildOutput');
        const appBuildOutput = new codepipeline.Artifact('AppBuildOutput');

        const sourceAction = new codepipeline_actions.CodeStarConnectionsSourceAction({
            actionName: 'GitHub',
            output: sourceOutput,
            connectionArn: "arn:aws:codestar-connections:eu-north-1:700595718361:connection/32191430-b2de-481b-b292-0c24114045da",
            owner: 'johannesg',
            repo: 'aws-cats',
            branch: props.gitBranch
        });

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
                ...props.cats.lambdaCode.assign(lambdaBuildOutput.s3Location),
                ...props.cats.appCode.assign(appBuildOutput.s3Location),
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