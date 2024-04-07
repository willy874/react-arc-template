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

async function injectModule(dynamicModules: DynamicRecord) {
  for (const key in dynamicModules) {
    const module = dynamicModules[key];
    if (module instanceof Promise) {
      module.then((m) => {
        Reflect.set(modules, key, m);
      });
    } else {
      Reflect.set(modules, key, module);
    }
  }
}

export async function registerModules(map: ModuleMap) {
  for (const key in modules) {
    const getDynamicModule = (await map?.[key]?.())?.default;
    if (getDynamicModule) {
      const { defineModuleDependencies, defineModuleExports, defineModuleContext } = getDynamicModule();
      if (defineModuleDependencies) {
        await registerModules(await defineModuleDependencies());
      }
      if (defineModuleExports) {
        await injectModule(await defineModuleExports());
      }
      if (defineModuleContext) {
        registerModuleContext(await defineModuleContext());
      }
    }
  }
}
