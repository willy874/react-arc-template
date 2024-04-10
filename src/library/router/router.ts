import { findNode, arrafi } from '../../utils/node';
import { Router as IRouter } from '../../core/context';

export class Router<R extends object> implements IRouter<R> {
  constructor(private readonly routes: R[] = []) {
    this.routes = routes;
  }

  addRoute(route: R | R[]) {
    const routes = arrafi(route);
    return this.routes.push(...routes);
  }

  addRouteByRoute(route: R | R[], target: R, insert: 'after' | 'before' = 'after') {
    const routes = arrafi(route);
    const result = findNode(this.routes, target);
    if (result) {
      const [target, index] = result;
      if (insert === 'after') {
        target.splice(index + 1, 0, ...routes);
      } else {
        target.splice(index, 0, ...routes);
      }
      return;
    }
    throw new Error('Route not found');
  }

  removeRoute(route: R) {
    const result = findNode(this.routes, route);
    if (result) {
      const [target, index] = result;
      return target.splice(index, 1)[0];
    }
    throw new Error('Route not found');
  }

  getRoutes(): R[] {
    return this.routes;
  }
}
