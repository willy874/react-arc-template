import { useContext } from 'react';
import { AppCtx } from './context';
import { modules } from './core/context';

const HelloWorld = modules.Hello.HelloWorld;

interface AppProps {}

function App({ ...props }: AppProps) {
  const ctx = useContext(AppCtx);
  return (
    <AppCtx.Provider value={{ ...props, ...ctx }}>
      <HelloWorld />
    </AppCtx.Provider>
  );
}

export default App;
