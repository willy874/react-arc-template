import { RouteObject } from 'react-router-dom';
import { Router } from './router';

export const router = new Router<RouteObject>();

export const defineRoutes = <R extends RouteObject[] | RouteObject>(route: R): R => route;
