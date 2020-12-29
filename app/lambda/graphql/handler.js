"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
async function resolveQuery(event) {
    var _a, _b, _c;
    console.debug(event.info);
    switch (event.info.fieldName) {
        case "hello":
            return "Hello Asshole!";
        case "me": {
            return { id: event.identity.username, email: (_c = (_b = (_a = event.identity) === null || _a === void 0 ? void 0 : _a.claims) === null || _b === void 0 ? void 0 : _b.email) !== null && _c !== void 0 ? _c : "" };
        }
        default:
            return "ERROR";
    }
}
async function handler(event) {
    console.log(event);
    switch (event.info.parentTypeName) {
        case "Query":
            return await resolveQuery(event);
        default:
            console.log(`Unknown type: ${event.info.parentTypeName}`);
            console.log(event.info);
            break;
    }
    return "ERROR";
}
exports.handler = handler;
