import { DefineModule } from '@/core/context';

function defineModuleExports() {
  return import('./ModuleExports');
}

function defineModuleContext() {
  return import('./ModuleContext');
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
  interface SliceEventMap {
    Article: GetModuleContextEventMap<typeof defineModuleContext>;
  }
}
