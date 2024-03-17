import { EventFunction, IsFunction, Unsubscribe } from "./utils"

export interface EventMethods<D extends Record<string, IsFunction>> {
  on: <T extends keyof D>(name: T, callback: (...args: Parameters<D[T]>) => void) => Unsubscribe
  once: <T extends keyof D>(name: T, callback: (...args: Parameters<D[T]>) => void) => Unsubscribe
  off: <T extends keyof D>(name: T, callback: (...args: Parameters<D[T]>) => void) => void
  emit: <T extends keyof D>(name: T, ...args: Parameters<D[T]>) => void
  rawListeners: <T extends keyof D>(name: T) => EventFunction[]
  listeners: <T extends keyof D>(name: T) => ((...args: Parameters<D[T]>) => void)[]
  listenerCount: <T extends keyof D>(name: T) => number
  eventNames: () => (keyof D)[]
  clear: () => void
  addEvents(events: Record<string, IsFunction>): void
}