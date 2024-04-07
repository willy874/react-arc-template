import React, { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

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
  .then((module) => module.default())
  .then(async () => ({
    App: lazy(() => import('./App')),
  }))
  .then(({ App }) => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  })

