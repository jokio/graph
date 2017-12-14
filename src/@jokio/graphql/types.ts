import { IResolvers } from "graphql-yoga/dist/src/types";
import { EngineConfig } from "apollo-engine";

export interface RunProps {
    port?: string
    endpoint?: string
    modules?: Module[]
    engineConfig?: EngineConfig
    subscriptionEndpoint?: string
    disablePub?: boolean
    disableSub?: boolean
}

export interface Module {
    typeDefs: string
    resolvers: IResolvers
}