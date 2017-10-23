import { ObjectType, Field } from "@jokio/graphql-decorator";
import { Channel } from "./channel.type";



@ObjectType()
export class Track {
    @Field({ nonNull: true })
    id: number

    @Field()
    info?: string

    @Field()
    duration?: number

    @Field()
    lyrics?: string

    @Field()
    youtubeVideoId?: string

    @Field()
    imageUrl?: string;
}