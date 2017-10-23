import { ObjectType, Field } from "@jokio/graphql-decorator";
import { Track } from "./track.type";
import * as gql from "graphql";


@ObjectType()
export class Channel {
    @Field({ type: gql.GraphQLID, nonNull: true })
    id: number

    @Field({ type: gql.GraphQLString, nonNull: true })
    name: string

    // @Field({ nonNull: true })
    // key: string

    // @Field()
    // source?: string

    // @Field()
    // logoUrl?: string

    // @Field()
    // stars?: number

    // @Field()
    // isFeatured?: boolean

    // @Field()
    // isOffline?: boolean

    // @Field()
    // isFavorite?: boolean

    // @Field()
    // offlineDate?: number

    // @Field()
    // createDate?: number

    // @Field({ type: Track })
    // track?: Track
}