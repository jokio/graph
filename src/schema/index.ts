import { Query, Mutation, Schema, schemaFactory, Subscription } from '@jokio/graphql-decorator';
import * as music from './music';

@Schema()
class RootSchema {
	@Query()
	MusicQuery: music.Query;

	// @Mutation()
	// MusicMutation: music.Mutation;

	// @Subscription()
	// MusicSubscription: music.Subscription;
}


const schema = schemaFactory(RootSchema);

export default schema;
