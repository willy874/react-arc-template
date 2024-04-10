import { DefineModule } from '@/core/context';

function defineModuleExports() {
  return import('./ModuleExports');
}

export default function getDynamicModule(): DefineModule {
  return {
    defineModuleExports,
  };
}

declare module '@/core/context' {
  interface ModuleSlices {
    Layout: GetDynamicModule<typeof defineModuleExports>;
  }
}
