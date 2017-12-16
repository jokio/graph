import { IResolvers } from "graphql-yoga/dist/src/types";
import { EngineConfig } from "apollo-engine";

export interface RunProps {
	port?: string
	endpoint?: string
	modules?: Module[]
	remtoeSchemaUrls?: string[]
	engineConfig?: EngineConfig
	subscriptionsEndpoint?: string
	disabledScalars?: boolean
	disableCoreModule?: boolean
}

export interface Module {
	typeDefs: string
	resolvers: IResolvers
}

declare var GlobalFetch: any;
