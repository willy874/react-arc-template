import { DefineModule } from '@/core/context'

function defineModuleDependencies() {
  return {
    Article: () => import('./Article'),
    Hello: () => import('./Hello'),
    Shared: () => import('./Shared'),
  }
}

export default function getDynamicModule(): DefineModule {
  return {
    defineModuleDependencies
  }
}
