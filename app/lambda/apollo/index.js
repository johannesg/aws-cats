"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const apollo_server_lambda_1 = require("apollo-server-lambda");
// const { initCosmos } = require("./datasources/cosmosdb");
// const { UserAPI } = require("./datasources/user");
const cats_1 = require("./datasources/cats");
// const { verifyToken } = require('./utils/jwt');
const schema_1 = __importDefault(require("./schema"));
const resolvers_1 = require("./resolvers");
// require("./datasources/dynamodb");
// let containers = {};
console.log(`Starting up`);
function getUserFromToken(req) {
    const Authorization = req.headers.Authorization;
    if (Authorization) {
        // const token = Authorization.replace('Bearer ', '');
        // const user = verifyToken(token);
        return { id: "kalle", email: "olle" };
    }
    return null;
}
function getUserFromClaims(claims) {
    const groups = claims['cognito:groups'].split(',');
    return {
        groups,
        email: claims.email,
        id: claims['cognito:username'],
        sub: claims.sub,
        email_verified: claims.email_verified,
        phone_number_verfied: claims.phone_number_verfied,
        iss: claims.iss,
        aud: claims.aud,
        event_id: claims.event_id,
        token_use: claims.token_use,
        auth_time: claims.auth_time,
        exp: claims.exp,
        iat: claims.iat
    };
}
const server = new apollo_server_lambda_1.ApolloServer({
    typeDefs: schema_1.default,
    resolvers: resolvers_1.resolvers,
    dataSources: () => {
        return {
            // UserAPI: new UserAPI(containers.users),
            CatsAPI: new cats_1.CatsAPI()
        };
    },
    context: (ctx) => {
        var _a, _b;
        const { context, event } = ctx;
        // console.log(`Context: ${ctx}`);
        console.log(ctx);
        // console.log(event.requestContext?.authorizer?.claims);
        const claims = (_b = (_a = event.requestContext) === null || _a === void 0 ? void 0 : _a.authorizer) === null || _b === void 0 ? void 0 : _b.claims;
        if (claims !== null && claims !== undefined) {
            const user = getUserFromClaims(claims);
            console.log(user);
            return {
                user
            };
        }
        return {
            user: getUserFromToken(event)
        };
    },
    plugins: [
        {
            async serverWillStart() {
                // containers = await initCosmos();
            }
        }
    ]
});
console.log(`Init complete. Node version: ${process.version}`);
exports.handler = server.createHandler();
