import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';

export const routes = [
  {
    path: '/article',
    Component: ArticleList,
  },
  {
    path: '/article/:id',
    Component: ArticleDetail,
  },
];

export const events = {
  'article:fetch': (id: string) => typeof id === 'string',
};
