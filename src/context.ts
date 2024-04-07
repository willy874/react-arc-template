import { AppContext } from './core/context';
import { createContext } from 'react';
import { eventBus } from './library/events';
import { router } from './library/router';
import { locale } from './library/locale';

export const AppCtx = createContext<AppContext>({
  locale,
  eventBus,
  router,
});
