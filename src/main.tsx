import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AppContext } from './core/context'
import { eventBus } from './library/events'
import { router } from './library/router'
import { locale } from './library/locale'

const appContext = {
  locale,
  eventBus,
  router,
} satisfies AppContext

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }
  const { worker } = await import('./mocks')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

Promise.resolve()
  .then(() => enableMocking())
  .then(() => import('./modules'))
  .then(({ registerModules }) => registerModules())
  .then(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App context={appContext} />
      </React.StrictMode>,
    )
  })

