function defineModuleExports() {
  return import('./ModuleExports');
}

export default function getDynamicModule() {
  return {
    defineModuleExports,
  };
}

declare module '@/core/context' {
  interface ModuleSlices {
    Layout: GetDynamicModule<typeof defineModuleExports>;
  }
}
