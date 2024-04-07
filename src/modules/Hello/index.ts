import { DefineModule, ModuleContext } from "@/core/context";
import { lazy } from "react";

async function defineModuleExports() {
  return {
    HelloWorld: lazy(() => import('./HelloWorld')),
  }
}

async function defineModuleContext(): Promise<ModuleContext> {
  return {}
}

export default function getDynamicModule(): DefineModule {
  return {
    defineModuleExports,
    defineModuleContext
  }
}

declare module "@/core/context" {
  interface ModuleSlices {
    Hello: GetDynamicModule<typeof defineModuleExports>
  }
}
