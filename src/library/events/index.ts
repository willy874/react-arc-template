import { SliceEventMap } from '@/core/context';
import { createEvent } from './createEvent';

type AllEventMap = SliceEventMap[keyof SliceEventMap];

export const eventBus = createEvent(
  {} as {
    [K in keyof AllEventMap]: AllEventMap[K];
  },
);
