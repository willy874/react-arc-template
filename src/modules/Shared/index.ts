import { DefineModule } from '@/core/context';

async function defineModuleExports() {
  return {};
}

async function defineModuleContext() {
  return {};
}

export default function getDynamicModule(): DefineModule {
  return {
    defineModuleExports,
    defineModuleContext,
  };
}

declare module '@/core/context' {
  interface ModuleSlices {
    Shared: GetDynamicModule<typeof defineModuleExports>;
  }
}
