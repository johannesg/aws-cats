const UserOps = {
    async register(_parent, { email, password }, { dataSources: { UserAPI } }) {
        console.log("Register User")
        return await UserAPI.createUser({ email, password });
    },

    async login(_parent, { email, password }, { dataSources: { UserAPI } }) {
        console.log("Login User")
        return await UserAPI.login({ email, password });
    },
};

module.exports = {
    UserOps
}