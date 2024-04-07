import { DefineModule, ModuleContext } from '@/core/context';

async function defineModuleExports() {
  return {
    services: import('./services'),
  };
}

async function defineModuleContext(): Promise<ModuleContext> {
  return {};
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
