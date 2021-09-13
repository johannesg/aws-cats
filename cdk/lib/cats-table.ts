import * as dynamodb from '@aws-cdk/aws-dynamodb';

import { CfnOutput, Construct } from '@aws-cdk/core';
import { AttributeType } from '@aws-cdk/aws-dynamodb';

export class CatsTable extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

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

        new CfnOutput(this, "TableName", { value: table.tableName, exportName: "cats-dynamodb-tablename" });
        new CfnOutput(this, "TableArn", { value: table.tableArn, exportName: "cats-dynamodb-tablearn"});
    }
}