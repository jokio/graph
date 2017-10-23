import { List, Field, ObjectType, Ctx, Root, Arg, PaginationResponse } from '@jokio/graphql-decorator';
import { PageInfo } from '@jokio/graphql-decorator/lib/page-info.type';
import { users } from '../../data';
import { Channel } from './types/channel.type';
import { HttpCodes } from 'typed-rest-client/HttpClient';
import { RestClient } from 'typed-rest-client/RestClient';


const api = new RestClient('Jok.Graph', 'http://x.jok.io');


export class Query {
	@Field({ type: Channel, isList: true })
	async musicChannels(
		@Arg({ name: 'offset' }) skip: number = 0,
		@Arg({ name: 'limit' }) take: number,
	): Promise<Channel[]> {

		const response = await api.get<Channel[]>('/music/channel/list');
		if (response.statusCode !== HttpCodes.OK) {
			throw new Error(`Data fetch error: ${response.statusCode}`);
		}

		const items = response.result;
		if (!items || items.length == null) {
			throw new Error(`Invalid data received`);
		}

		take = take || 10;


		return items.slice(skip || 0, skip + take);

		// return new PaginationResponse(
		// 	items.length,
		// 	items.slice(skip || 0, skip + take),
		// 	new PageInfo(items.length, skip, take)
		// );
	}
}
