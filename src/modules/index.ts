import { Module, ModuleMap, SliceContext } from '@/core/context'
import { eventBus } from '@/library/events'
import { locale } from '@/library/locale'
import { router } from '@/library/router'
import { modules } from './modules'

const modulesMap: ModuleMap = {
  Login: () => import('./Login'),
  User: () => import('./User'),
  Article: () => import('./Article'),
  Shared: () => import('./Shared'),
}

function registerSlice(slice: SliceContext) {
  if (slice.locale) locale.register(slice.locale)
  if (slice.routes) router.addRoute(slice.routes)
  if (slice.events) eventBus.addEvents(slice.events)
}

export async function registerModules() {
  const map = {} as Record<string, Module>
  for (const key in modules) {
    const module = await modulesMap[key]()
    if (module.ExportModule) {
      (modules as any)[key] = module.ExportModule
    }
    if (module.default) {
      registerSlice(module.default())
    }
    map[key] = module
  }
  return map
}
