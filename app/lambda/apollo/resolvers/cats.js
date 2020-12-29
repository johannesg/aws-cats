"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cats = void 0;
exports.Cats = {
    random: async (_, { pageSize }, { dataSources: { CatsAPI } }) => {
        return await CatsAPI.getRandomCats(pageSize);
        // return [
        //     {
        //         id: "123",
        //         url: "http://",
        //         width: 123,
        //         height: 123
        //     },
        //     {
        //         id: "125",
        //         url: "http://",
        //         width: 123,
        //         height: 123
        //     }
        // ];
    }
};
