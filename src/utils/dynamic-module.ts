import { modules } from '@/core/context';
import type { ModuleMap, ModuleContext, DynamicRecord } from '@/core/context';
import { eventBus } from '@/library/events';
import { locale } from '@/library/locale';
import { router } from '@/library/router';

function registerModuleContext(slice: ModuleContext) {
  if (slice.locale) locale.register(slice.locale);
  if (slice.routes) router.addRoute(slice.routes);
  if (slice.events) eventBus.addEvents(slice.events);
}

async function injectModule(dynamicModules: DynamicRecord, name: string) {
  if (name in modules) return;
  const newModules: Record<string, unknown> = {};
  Reflect.set(modules, name, newModules);
  for (const key in dynamicModules) {
    const module = dynamicModules[key];
    if (module instanceof Promise) {
      module.then((m) => {
        newModules[key] = m;
      });
    } else {
      newModules[key] = module;
    }
  }
}

export async function registerModules(map: ModuleMap, depPath: string[] = []) {
  for (const key in map) {
    if (depPath.includes(key)) {
      throw new Error(`Circular dependency detected: ${depPath.join(' -> ')} -> ${key}`);
    }
    const getDynamicModule = (await map?.[key]?.())?.default;
    if (getDynamicModule) {
      const { defineModuleDependencies, defineModuleExports, defineModuleContext } = getDynamicModule();
      if (defineModuleDependencies) {
        await registerModules(await defineModuleDependencies(), depPath.concat(key));
      }
      if (defineModuleExports) {
        await injectModule(await defineModuleExports(), key);
      }
      if (defineModuleContext) {
        registerModuleContext(await defineModuleContext());
      }
    }
  }
  return modules;
}
