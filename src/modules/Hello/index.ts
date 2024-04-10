import { DefineModule, ModuleContext } from '@/core/context';
import { lazy } from 'react';

async function defineModuleExports() {
  return {};
}

async function defineModuleContext(): Promise<ModuleContext> {
  return {
    routes: [
      {
        path: '/',
        Component: lazy(() => import('./HelloWorld')),
      },
    ],
  };
}

export default function getDynamicModule(): DefineModule {
  return {
    defineModuleExports,
    defineModuleContext,
  };
}

declare module '@/core/context' {
  interface ModuleSlices {
    Hello: GetDynamicModule<typeof defineModuleExports>;
  }
}
