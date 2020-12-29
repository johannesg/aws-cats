const { AuthenticationError } = require('apollo-server-lambda');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const { createQuery } = require('./cosmosdb/dbutils');

class UserAPI {
    constructor(container) {
        this.container = container;
    }

    initialize({ context }) {
        this.context = context;
    }

    async createUser({ email, password }) {
        const hash = await bcrypt.hash(password, 10);
        const { resource: user } = await this.container.items.create({ email, password: hash });

        const token = generateToken(user);
        return { token, user };
    }

    async login({ email, password }) {
        const q = createQuery("SELECT * FROM Users u WHERE u.email = @email", { email });

        const { resources } = await this.container.items.query(q).fetchNext();
        if (!resources || resources.length !== 1)
            throw new AuthenticationError("Login failed");

        const [user] = resources;

        if (!await bcrypt.compare(password, user.password))
            throw new AuthenticationError("Login failed");

        const token = generateToken(user);
        return { token, user };
    }
}

module.exports = {
    UserAPI
};