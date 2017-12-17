import { PubSub } from "graphql-subscriptions/dist/pubsub";
import { clearInterval } from "timers";
import * as usage from 'usage';
import { Resolvers, Context } from "../types";

export const SYSTEM_INFO_EVENT = 'SystemInfoEvent';

export const typeDefs = `
type Query {
	serverInfo: ServerInfo
}

type Mutation {
	startRealtimeServerInfo(interval: Int): Boolean
	stopRealtimeServerInfo: Boolean
}

type Subscription {
	serverInfo: ServerInfo
}

type ServerInfo {
	processId: Int
	startTime: DateTime
	upTime: ServerUpTime
	cpu: Float
	rssInMB: Float
	vsizeInMB: Float
}

type ServerUpTime {
	inSec: Float
	inMin: Float
	inHour: Float
	inDay: Float
}
`

const startTime = Date.now();
let realtimeServerInfoHandler = null;

export const resolvers: Resolvers<Context> = {
	Query: {
		serverInfo: async () => await getServerInfo()
	},

	Mutation: {
		startRealtimeServerInfo: (obj, { interval = 1000 }, { pubsub }) => {
			clearInterval(realtimeServerInfoHandler);

			realtimeServerInfoHandler = setInterval(
				async () =>
					pubsub.publish(SYSTEM_INFO_EVENT, {
						serverInfo: await getServerInfo()
					})
				, interval
			);

			return true;
		},

		stopRealtimeServerInfo: () => clearInterval(realtimeServerInfoHandler),
	},

	Subscription: {
		serverInfo: {
			subscribe: (obj, props, { pubsub, token }) =>
				pubsub.asyncIterator(SYSTEM_INFO_EVENT)
		}
	}
}

export default {
	typeDefs,
	resolvers
}


function getServerInfo() {
	return new Promise((resolve, error) => {
		usage.lookup(process.pid, (err, result) => {
			if (err) {
				error(err);
				return;
			}

			const { cpu, memoryInfo } = result;
			const mb = 1024 * 1024;

			const systemInfo = {
				processId: process.pid,
				cpu: cpu,
				rssInMB: memoryInfo.rss / mb,
				vsizeInMB: memoryInfo.rss / mb,

				startTime: new Date(startTime),
				upTime: {
					inSec: (Date.now() - startTime) / (1000),
					inMin: (Date.now() - startTime) / (1000 * 60),
					inHour: (Date.now() - startTime) / (1000 * 60 * 60),
					inDay: (Date.now() - startTime) / (1000 * 60 * 60 * 24),
				}
			};

			resolve(systemInfo);
		});
	});
}
