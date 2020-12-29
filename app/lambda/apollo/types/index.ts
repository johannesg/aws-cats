import { CatsAPI } from "../datasources/cats";

export interface Resolver {

}

export interface User {
    id: string
    email: string
}

export interface Cat {
    id: string
    url: string
    height: number
    width: number
}

export interface ICatsAPI {
    getRandomCats(pageSize : number): [Cat]
}

export interface DataSources {
    CatsAPI: ICatsAPI
}

export interface Context {
    user: User
    dataSources: DataSources
}