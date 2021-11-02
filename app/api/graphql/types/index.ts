// import { DynamoDBDataSource } from '../datasources/dynamodb';
import { User, Cat } from './gen-types';

export interface ICatsAPI {
    getRandomCats(pageSize : number): Promise<[Cat]>
}

export interface DataSources {
    CatsAPI: ICatsAPI
    // DynamoDB: DynamoDBDataSource
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

export type Context = {
    user: UserExt
}

export type ContextWithDataSources = Context & {
    dataSources: DataSources
}

export * from './gen-types';