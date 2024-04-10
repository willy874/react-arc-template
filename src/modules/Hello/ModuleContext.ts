import { lazy } from 'react';

export const routes = [
  {
    path: '/',
    Component: lazy(() => import('./HelloWorld')),
  },
];
