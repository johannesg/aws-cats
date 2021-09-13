import { Construct, Stack, StackProps } from '@aws-cdk/core';

import { CatsCognito } from './cats-cognito';
import { CatsTable } from './cats-table';

export class CatsResourcesStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps | undefined) {
        super(scope, id, props);

        new CatsCognito(this, "Cognito");
        new CatsTable(this, "Table");
    }
}
