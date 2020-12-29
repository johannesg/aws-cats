

function createQuery(query, params) {
    return {
        query,
        parameters: Object.entries(params)
            .map(([name, value]) => ({ name: `@${name}`, value }))
    };
}

module.exports = {
    createQuery
};