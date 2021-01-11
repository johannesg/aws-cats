import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

import { Construct } from '@aws-cdk/core';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';

export type CatsTableProps = {

}

export class CatsTable extends Construct {
    public readonly table : Table;

    constructor(scope: Construct, id: string, props: CatsTableProps) {
        super(scope, id);

        this.table = new dynamodb.Table(this, 'Cats', {
            partitionKey: { name: 'PK', type: AttributeType.STRING },
            sortKey: { name: 'SK', type: AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
        });
    }
}