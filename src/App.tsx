
import { AppContext, AppCtx } from "./core/context"
import Hello from "./pages/Hello"

interface AppProps {
  context: AppContext
}

function App({ context }: AppProps) {
  return (
    <AppCtx.Provider value={context}>
      <Hello />
    </AppCtx.Provider>
  )
}

export default App
