import { IResolvers } from "graphql-yoga/dist/src/types";
import { EngineConfig } from "apollo-engine";
import { PubSub, Options } from "graphql-yoga";
import { RestAPI } from "./api";
import { Request } from "express";
import { ConnectionContext } from "subscriptions-transport-ws";

export interface RunProps {
	port?: string
	endpoint?: string
	modules?: Module[]
	remtoeSchemaUrls?: string[]
	apiUrls?: { [key: string]: string }
	engineConfig?: EngineConfig
	subscriptionEndpoint?: string
	disabledScalars?: boolean
	disableCoreModule?: boolean
	websocketConnectionParams?: { [key: string]: string }
	tokenName?: string
	getHttpToken?: (request: Request, tokenName: string) => string
	getWsToken?: (connection: ConnectionContext, tokenName: string) => string

	yogaOptions?: Options

	enableAuthentication?: boolean
	getUserId?: (token: string, apis: { [key: string]: RestAPI }) => Promise<string>
}

export interface Module {
	typeDefs: string
	resolvers: IResolvers
}


export interface Resolvers<ContextType> {
	[key: string]: Resolver<ContextType> | SubscriptionResolver<ContextType>
}

interface Resolver<ContextType> {
	[key: string]: (obj, props, context: ContextType, info: any) => any
}

interface SubscriptionResolver<ContextType> {
	[key: string]: {
		subscribe: (obj, props, context: ContextType, info: any) => any
	}
}

export interface Context {
	token: string
	userId: string
	pubsub: PubSub
}
