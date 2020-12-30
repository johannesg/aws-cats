import { User, Cat } from './gen-types';

export interface ICatsAPI {
    getRandomCats(pageSize : number): Promise<[Cat]>
}

export interface DataSources {
    CatsAPI: ICatsAPI
}

export type UserExt = User & {
    groups : string[]
    sub?: string
    email_verified?: string
    phone_number_verfied?: string
    iss?: string
    aud?: string
    event_id?: string
    token_use?: string
    auth_time?: string
    exp?: string
    iat?: string
}

export interface Context {
    user: UserExt
    dataSources: DataSources
}

export * from './gen-types';