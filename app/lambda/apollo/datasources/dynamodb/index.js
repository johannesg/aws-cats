
const AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-north1",
    endpoint: "http://dynamodb:8000"
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "Users",
    KeySchema: [       
        { AttributeName: "email", KeyType: "HASH"},  //Partition key
        // { AttributeName: "password", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "email", AttributeType: "S" },
        // { AttributeName: "password", AttributeType: "S" },
    ],
    BillingMode: "PAY_PER_REQUEST"
};

console.log(`Creating dynamodb table Users`)

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});