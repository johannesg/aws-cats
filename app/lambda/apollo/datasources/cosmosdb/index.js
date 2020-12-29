const { CosmosClient } = require("@azure/cosmos");
const { UserAPI } = require("../user");

const connectionString = process.env.COSMOS_CONNECTION_STRING;
const databaseId = process.env.COSMOS_DATABASE;

const userContainer = {
    options: {
        id: "Users",
        partitionKey: null,
        uniqueKeyPolicy: {
            uniqueKeys: [
                { paths: ['/email'] },
            ]
        }
    },
    init: async (container) => {
        const { resources } = await container.items.query("select count(1) from c").fetchAll();
        if (resources && resources.length === 1 && resources[0]["$1"] > 0)
            return;

        console.log("Creating first user");

        await new UserAPI(container).createUser({ email: "admin", password: "admin"});
    }
}

const containerOpts = {
    users: userContainer
}

module.exports = {
    initCosmos: async function () {
        console.log(`Connecting to Cosmos DB`);
        const client = new CosmosClient(`${connectionString}`);

        console.log(`Setup database ${databaseId}`);
        const { database } = await client.databases.createIfNotExists({ id: databaseId });
        const containers = Object.entries(containerOpts)
            .map(async ([key, { options, init }]) => {
                console.log(`Setup container ${options.id}`);
                const { container, resource } = await database.containers
                    .createIfNotExists(options, { offerThroughput: 400 });

                if (init)
                    await init(container);

                return [key, container];
            });

        return Object.fromEntries(await Promise.all(containers));
    },
}