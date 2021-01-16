import { CatsResolvers, Context } from "../types"

export const Cats : CatsResolvers = {
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