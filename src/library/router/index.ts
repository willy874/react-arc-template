import { RouteObject } from 'react-router-dom';
import { Router } from "./router";
import { routes } from "./routes";

export const router = new Router(routes);

export const defineRoutes = <R extends RouteObject[] | RouteObject>(route: R): R => route
