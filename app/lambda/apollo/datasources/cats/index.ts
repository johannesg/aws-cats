
import { RESTDataSource } from 'apollo-datasource-rest';

export class CatsAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = "https://api.thecatapi.com/v1/"
    }

    async getRandomCats(pageSize: number)  {
        const res = await this.get('images/search', { limit: pageSize });
        return res;
    }
}