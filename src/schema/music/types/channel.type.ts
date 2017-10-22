import { ObjectType, Field } from "@jokio/graphql-decorator";
import { Track } from "./track.type";


@ObjectType()
export class Channel {
    @Field({ nonNull: true })
    id: number

    @Field({ nonNull: true })
    name: string

    @Field({ nonNull: true })
    key: string

    @Field()
    source?: string

    @Field()
    logoUrl?: string

    @Field()
    stars?: number

    @Field()
    isFeatured?: boolean

    @Field()
    isOffline?: boolean

    @Field()
    isFavorite?: boolean

    @Field()
    offlineDate?: number

    @Field()
    createDate?: number

    @Field({ type: Track })
    track?(): Track {
        return {
            id: 1,
            info: 'alleluia'
        }
    }
}