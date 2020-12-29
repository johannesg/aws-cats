"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatsAPI = void 0;
const apollo_datasource_rest_1 = require("apollo-datasource-rest");
class CatsAPI extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super();
        this.baseURL = "https://api.thecatapi.com/v1/";
    }
    async getRandomCats(pageSize) {
        const res = await this.get('images/search', { limit: pageSize });
        return res;
    }
}
exports.CatsAPI = CatsAPI;
