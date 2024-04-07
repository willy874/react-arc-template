
import { AppContext, AppCtx } from "./core/context"
import { HelloWorld } from "./modules/Hello"

interface AppProps {
  context: AppContext
}

function App({ context }: AppProps) {
  return (
    <AppCtx.Provider value={context}>
      <HelloWorld />
    </AppCtx.Provider>
  )
}

export default App
