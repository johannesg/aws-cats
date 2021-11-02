// import { DataSource, DataSourceConfig } from 'apollo-datasource';
// import { Context, User } from '../../types';
// // import * as AWS from 'aws-sdk';
// import { DynamoDB } from "@aws-sdk/client-dynamodb";
// import * as db from "@aws-sdk/client-dynamodb";
// import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

// // AWS.config.update({region:'us-east-1'});

// export class DynamoDBDataSource extends DataSource<Context> {
//     private context!: Context;
//     private client!: DynamoDB;
//     private tableName: string = process.env.DYNAMODB_TABLENAME ?? "Cats";

//     initialize({ context, cache }: DataSourceConfig<Context>) {
//         const endpoint = process.env.DYNAMODB_ENDPOINT;
//         const region = process.env.DYNAMODB_REGION;

//         console.log(`DynamoDB endpoint: ${endpoint ?? "remote"}`);
//         console.log(`DynamoDB table: ${this.tableName}`);

//         this.context = context;
//         this.client = new DynamoDB({ endpoint, region });
//     }

//     createKey(entity: string, id: string) {
//         return marshall({
//             PK: `${entity}/${id}`,
//             SK: `${entity}/${id}` 
//         });
//     }

//     async getUser(): Promise<User | undefined> {
//         const params = {
//             TableName: this.tableName,
//             Key: this.createKey('user', this.context?.user?.id ?? "")
//         };

//         const { Item } = await this.client.getItem(params);
//         if (Item) {
//             const user = unmarshall(Item);

//             return {
//                 ...this.context.user,
//                 ...user
//             };
//         }
//         else
//             return undefined;
//     }

//     async putUser(firstName: string, lastName: string) {
//         const item = {
//             ...this.createKey('user', this.context?.user?.id ?? ""),
//             ...marshall({ firstName, lastName })
//         }
//         console.log(item);
//         const params = {
//             TableName: this.tableName,
//             Item: item
//         };

//         const res = await this.client.putItem(params);
//     }
// }