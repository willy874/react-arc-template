import { setupWorker } from 'msw/browser'
import getLoginHandlers from './login'
 
export const worker = setupWorker(...[
  ...getLoginHandlers(),
])