import { createContext } from "react"
import { RouteObject } from "react-router-dom";
import { DeepReadonly, IsFunction } from "./utils";
import { LocaleInstance, ResourceBundle } from "./locale";
import { EventMethods } from "./events";

export interface Router<R> {
	addRoute(route: R | R[]): void;
	addRouteByRoute(route: R | R[], target: R, insert: 'after' | 'before'): void;
	removeRoute(route: R | R[]): void;
	getRoutes(): DeepReadonly<R[]>;
}

export interface AppContext {
	eventBus: EventMethods<Record<string, IsFunction>>;
	locale: LocaleInstance;
	router: Router<RouteObject>;
}

export const AppCtx = createContext({} as AppContext)


export interface SliceContext {
	events?: Record<string, IsFunction>;
	locale?: ResourceBundle;
	routes?: RouteObject[];
}

export type Module = {
	__esModule?: boolean;
	ExportModule?: object;
	default?: () => SliceContext;
	[key: string]: unknown;
}

export type ModuleMap = Record<string, () => Promise<Module>>;

export interface SliceModule {}
