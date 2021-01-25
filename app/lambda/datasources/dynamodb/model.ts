export type EntityBase = {
    PK: string
    SK: string
}

export type Profile = EntityBase & {
    type: "profile"
    username: string
    firstName: string
    lastName: string
    email: string
}

export type CatFavourite = EntityBase & {
    type: "fav"
    catId: string
}

export type Cat = EntityBase & {
    type: "cat"
}

export type Entity = Profile | CatFavourite | Cat