import { Stack, Construct, StackProps } from '@aws-cdk/core';
import { Repository } from '@aws-cdk/aws-codecommit';
import codepipeline from '@aws-cdk/aws-codepipeline';
import codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';

export class CatsPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // Creates a CodeCommit repository called 'WorkshopRepo'
        const repo = new Repository(this, 'CatsRepo', {
            repositoryName: "CatsRepo"
        });

        // Defines the artifact representing the sourcecode
        const sourceArtifact = new codepipeline.Artifact();
        // Defines the artifact representing the cloud assembly 
        // (cloudformation template + all other assets)
        const cloudAssemblyArtifact = new codepipeline.Artifact();

        // The basic pipeline declaration. This sets the initial structure
        // of our pipeline
        new CdkPipeline(this, 'Pipeline', {
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
            })
        })
    }
}