import { Stack, Construct, StackProps } from '@aws-cdk/core';
import { Repository } from '@aws-cdk/aws-codecommit';

export class CatsPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

         // Creates a CodeCommit repository called 'WorkshopRepo'
         new Repository(this, 'CatsRepo', {
            repositoryName: "CatsRepo"
        });
        // Pipeline code goes here
    }
}