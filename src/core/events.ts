import { IsFunction, Unsubscribe } from "./utils"

export interface EventMethods<D extends Record<string, IsFunction>> {
  on: <T extends keyof D>(name: T, callback: (...args: Parameters<D[T]>) => void) => Unsubscribe
  once: <T extends keyof D>(name: T, callback: (...args: Parameters<D[T]>) => void) => Unsubscribe
  off: <T extends keyof D>(name: T, callback: (...args: Parameters<D[T]>) => void) => void
  emit: <T extends keyof D>(name: T, ...args: Parameters<D[T]>) => void
  eventCount: <T extends keyof D>(name: T) => number
  eventNames: () => (keyof D)[]
  getListeners: <T extends keyof D>(name: T) => ((...args: Parameters<D[T]>) => void)[]
  addEvents: (events: D) => void
}