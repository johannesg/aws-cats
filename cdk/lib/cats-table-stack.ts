import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

import { CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
import { Table, AttributeType, ProjectionType } from '@aws-cdk/aws-dynamodb';

export type CatsTableProps = {

}

export class CatsTableStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps | undefined) {
        super(scope, id, props);

        const table = new dynamodb.Table(this, 'Cats', {
            partitionKey: { name: 'PK', type: AttributeType.STRING },
            sortKey: { name: 'SK', type: AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
        });

        table.addGlobalSecondaryIndex({
            indexName: "GSI1",
            partitionKey: { name: 'GSI1_PK', type: AttributeType.STRING},
            sortKey: { name: 'GSI1_SK', type: AttributeType.STRING }
        })

        new CfnOutput(this, "TableName", { value: table.tableName });
        new CfnOutput(this, "TableArn", { value: table.tableArn });
    }
}