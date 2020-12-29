import { Context } from "../types"

export const Cats = {
        random: async (_ : any, { pageSize } : { pageSize: number}, { dataSources: { CatsAPI } } : Context) => {
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