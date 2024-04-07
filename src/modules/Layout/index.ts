import { DefineModule, ModuleContext } from '@/core/context';

async function defineModuleExports() {
  return {};
}

async function defineModuleContext(): Promise<ModuleContext> {
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
    Layout: GetDynamicModule<typeof defineModuleExports>;
  }
}
