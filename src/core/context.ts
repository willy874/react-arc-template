import { RouteObject } from 'react-router-dom';
import { IsFunction } from './utils';
import { LocaleInstance, ResourceBundle } from './locale';
import { EventMethods } from './events';

export interface Router<R> {
  addRoute(route: R | R[]): void;
  addRouteByRoute(route: R | R[], target: R, insert: 'after' | 'before'): void;
  removeRoute(route: R | R[]): void;
  getRoutes(): R[];
}

export interface AppContext {
  eventBus: EventMethods<Record<string, IsFunction>>;
  locale: LocaleInstance;
  router: Router<RouteObject>;
}

export interface ModuleContext {
  events?: Record<string, IsFunction>;
  locale?: ResourceBundle;
  routes?: RouteObject[];
}

export type DynamicRecord = Record<string, Promise<unknown> | unknown>;

export type DynamicModule = () => Promise<DynamicRecord> | DynamicRecord;

export type DefineModule = {
  defineModuleContext?: () => Promise<ModuleContext>;
  defineModuleExports?: DynamicModule;
  defineModuleDependencies?: () => ModuleMap;
};

export type Module<T = undefined> = {
  __esModule?: boolean;
  default?: T;
  [key: string]: unknown;
};

export type ModuleMap = Record<string, () => Promise<Module<() => DefineModule>>>;

export interface ModuleSlices extends Record<string, any> {}

export const modules = {} as ModuleSlices;

export type GetDynamicModule<T extends DynamicModule, M = Awaited<ReturnType<T>>> = { [K in keyof M]: Awaited<M[K]> };
