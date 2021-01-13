import { Stack, Construct, StackProps } from '@aws-cdk/core';
import { Repository } from '@aws-cdk/aws-codecommit';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';
import { CatsPipelineStage } from './pipeline-stage';

export class CatsPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // Creates a CodeCommit repository called 'WorkshopRepo'
        const repo = new Repository(this, 'CatsRepo', {
            repositoryName: "CatsRepo"
        });

        // Defines the artifact representing the sourcecode
        const sourceArtifact = new codepipeline.Artifact("CdkSource");
        // Defines the artifact representing the cloud assembly 
        // (cloudformation template + all other assets)
        const cloudAssemblyArtifact = new codepipeline.Artifact("CdkAssembly");

        // The basic pipeline declaration. This sets the initial structure
        // of our pipeline
        const pipeline = new CdkPipeline(this, 'Pipeline', {
            pipelineName: 'WorkshopPipeline',
            cloudAssemblyArtifact,

            // Generates the source artifact from the repo we created in the last step
            sourceAction: new codepipeline_actions.CodeCommitSourceAction({
                actionName: 'CodeCommit', // Any Git-based source control
                output: sourceArtifact, // Indicates where the artifact is stored
                repository: repo // Designates the repo to draw code from
            }),

            // Builds our source code outlined above into a could assembly artifact
            synthAction: SimpleSynthAction.standardNpmSynth({
                sourceArtifact, // Where to get source code to build
                cloudAssemblyArtifact, // Where to place built source

                buildCommand: 'npm run build', // Language-specific build cmd
                subdirectory: 'cdk'
            }),
        });

        // const build = new CatsPipelineBuildStage(this, 'BuildAssets', { source: sourceArtifact });
        // pipeline.addApplicationStage(build);

        const lambdaBuildOutput = new codepipeline.Artifact('LambdaBuildOutput');
        const appBuildOutput = new codepipeline.Artifact('AppBuildOutput');

        const deploy = new CatsPipelineStage(this, 'Deploy', { appArtifact: appBuildOutput, lambdaArtifact: lambdaBuildOutput });
        const deployStage = pipeline.addApplicationStage(deploy);
        deployStage.addActions(
            this.createLambdaBuildAction(sourceArtifact, lambdaBuildOutput),
            this.createAppBuildAction(sourceArtifact, appBuildOutput)
        );
    }

    createLambdaBuildAction(source: codepipeline.Artifact, output: codepipeline.Artifact): codepipeline.IAction {
        const lambdaBuild = new codebuild.PipelineProject(this, 'LambdaBuild', {
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    install: {
                        commands: [
                            'cd app/lambda/apollo',
                            'npm ci',
                        ],
                    },
                    build: {
                        commands: 'npm run esbuild',
                    },
                },
                artifacts: {
                    'base-directory': 'app/lambda/apollo',
                    files: [
                        'index.js'
                    ],
                },
            }),
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
            },
        });

        return new codepipeline_actions.CodeBuildAction({
            actionName: 'Lambda_Build',
            project: lambdaBuild,
            input: source,
            outputs: [output],
        });
    }

    createAppBuildAction(source: codepipeline.Artifact, output: codepipeline.Artifact): codepipeline.IAction {
        const appBuild = new codebuild.PipelineProject(this, 'AppBuild', {
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    install: {
                        commands: [
                            'cd app/client',
                            'npm ci',
                        ],
                    },
                    build: {
                        commands: 'npm run build',
                    },
                },
                artifacts: {
                    'base-directory': 'app/client/public',
                    files: [
                        '**/*'
                    ],
                },
            }),
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
            },
        });

        return new codepipeline_actions.CodeBuildAction({
            actionName: 'App_Build',
            project: appBuild,
            input: source,
            outputs: [output],
        });
    }
}