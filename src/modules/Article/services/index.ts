import { authInstance } from '@/library/http';
import { Article } from '../models';

const fetchArticles = () => {
  return authInstance
    .get('/articles')
    .then((response) => response.data as Article[])
    .catch((error) => {
      throw new Error(error);
    });
};

export { fetchArticles };
