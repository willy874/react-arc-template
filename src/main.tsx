import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import getDynamicModule from './modules';
import { registerModules } from './utils/dynamic-module';
// import App from './App';

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  const { worker } = await import('./mocks');
  return worker.start({ onUnhandledRequest: 'bypass' });
}

Promise.resolve()
  .then(() => enableMocking())
  .then(() => {
    const { defineModuleDependencies } = getDynamicModule();
    return registerModules(defineModuleDependencies());
  })
  .then((modules) => {
    console.log(modules);
    const App = lazy(() => import('./App'));
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  });
