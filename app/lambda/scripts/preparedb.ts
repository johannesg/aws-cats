import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import * as db from "@aws-sdk/client-dynamodb";

console.log("Preparing db");

(async () => {
    const client = new DynamoDBClient({
        region: "eu-north1",
        endpoint: "http://localhost:8800"
    });

    await createTable(client, "Cats");
})();

async function createTable(client: DynamoDBClient, tableName: String) {
    const res = await client.send(new db.ListTablesCommand({}));
    if (res.TableNames && res.TableNames.find(tn => tn === tableName)) {
        console.log(`Table ${tableName} already exists`);
        return;
    }
    
    const cmd = new db.CreateTableCommand({
        TableName: "Cats",
        KeySchema: [
            { AttributeName: "PK", KeyType: "HASH" },  //Partition key
            { AttributeName: "SK", KeyType: "RANGE" }  //Sort key
        ],
        AttributeDefinitions: [
            { AttributeName: "PK", AttributeType: "S" },
            { AttributeName: "SK", AttributeType: "S" },
            // { AttributeName: "password", AttributeType: "S" },
        ],
        BillingMode: "PAY_PER_REQUEST"
    });

    await client.send(cmd);
    console.log("Table created");
}