import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AppContext, SliceContext } from './core/context'
import { eventBus } from './library/events'
import { router } from './library/router'
import { locale } from './library/locale'

const appContext = {
  locale,
  eventBus,
  router,
} satisfies AppContext

type SliceModule = { default: () => SliceContext }

Promise.resolve()
  .then(() => {
    return Promise.all([
      import('./pages/Login'),
      import('./pages/User'),
      import('./pages/Article'),
    ])
  })
  .then((modules: SliceModule[]) => {
    modules.forEach((module) => {
      const slice = module.default()
      if (slice.locale) locale.register(slice.locale)
      if (slice.routes) router.addRoute(slice.routes)
      if (slice.events) eventBus.addEvents(slice.events)
    })
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App context={appContext} />
      </React.StrictMode>,
    )
  })
