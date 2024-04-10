import { useContext } from 'react';
import { AppCtx } from './context';
import RouterProvider from './library/router/RouterProvider';
import { modules } from '@/core/context';

console.log(modules);

function App() {
  const ctx = useContext(AppCtx);
  return (
    <AppCtx.Provider value={ctx}>
      <RouterProvider router={ctx.router} />
    </AppCtx.Provider>
  );
}

export default App;
