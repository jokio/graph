import { RestAPI, Context } from "@jokio/graphql";

export interface Context extends Context {
	api: RestAPI
}
