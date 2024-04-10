import { DefineModule, ModuleContext } from '@/core/context';
import { lazy } from 'react';

async function defineModuleExports() {
  return {
    Layout: lazy(() => import('./components/Layout')),
    Header: lazy(() => import('./components/Header')),
  };
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
