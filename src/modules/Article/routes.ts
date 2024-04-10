import { lazy } from 'react';

export const routes = [
  {
    path: '/article',
    Component: lazy(() => import('./pages/ArticleList')),
  },
  {
    path: '/article/:id',
    Component: lazy(() => import('./pages/ArticleDetail')),
  },
];
