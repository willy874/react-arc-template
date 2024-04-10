import { DefineModule, ModuleContext } from '@/core/context';

import { routes } from './routes';

async function defineModuleExports() {
  return {
    services: import('./services'),
  };
}

async function defineModuleContext(): Promise<ModuleContext> {
  return {
    routes,
  };
}

function defineModuleDependencies() {
  return {
    Layout: () => import('@/modules/Layout'),
  };
}

export default function getDynamicModule(): DefineModule {
  return {
    defineModuleExports,
    defineModuleContext,
    defineModuleDependencies,
  };
}

declare module '@/core/context' {
  interface ModuleSlices {
    Article: GetDynamicModule<typeof defineModuleExports>;
  }
}
