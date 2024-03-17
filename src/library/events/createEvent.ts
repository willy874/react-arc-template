import { EventMethods } from "../../core/events"
import { EventFunction, IsFunction } from "../../core/utils"


export function createEvent<T extends Record<string, IsFunction>>(defines: T): EventMethods<T> {
  const eventCollection = {} as Record<keyof T, EventFunction[]>
  const handlerMap = new Map<EventFunction, EventFunction>()
  const reset = () => {
    for (const key in defines) {
      eventCollection[key] = []
    }
  }
  const unsubscribe = <N extends keyof T>(name: N, callback: (...args: Parameters<T[N]>) => void) => {
    const handler = handlerMap.get(callback)
    eventCollection[name] = eventCollection[name].filter(h => h !== handler)
    handlerMap.delete(callback)
  }
  const subscribe = <N extends keyof T>(name: N, callback: (...args: Parameters<T[N]>) => void, once: boolean) => {
    const handler = (...args: unknown[]) => {
      callback(...args as Parameters<typeof callback>)
      if (once) unsubscribe(name, callback)
    }
    if (handlerMap.has(callback)) {
      throw new Error('Callback already registered')
    }
    handlerMap.set(callback, handler)
    eventCollection[name] = eventCollection[name].concat(handler)
    return () => unsubscribe(name, callback)
  }
  return {
    on(name, callback) {
      return subscribe(name, callback, false)
    },
    once(name, callback) {
      return subscribe(name, callback, true)
    },
    off(name, callback) {
      unsubscribe(name, callback)
    },
    emit(name, ...args) {
      for (const handler of eventCollection[name]) {
        if (defines[name](...args)) {
          handler(...args)
        }
      }
    },
    rawListeners(name) {
      return eventCollection[name]
    },
    listeners(name) {
      return eventCollection[name].map(handler => {
        const callback = handlerMap.get(handler)
        if (!callback) throw new Error('Callback not found')
        return callback
      })
    },
    listenerCount(name) {
      return eventCollection[name].length
    },
    eventNames() {
      return Object.keys(defines) as (keyof T)[]
    },
    clear() {
      reset()
      handlerMap.clear()
    },
    addEvents(events: Record<string, IsFunction>) {
      const off: (() => void)[] = []
      for (const key in events) {
        const callback = events[key]
        off.push(subscribe(key, callback, false))
      }
      return () => {
        off.forEach(unsub => unsub())
      }
    }
  }
}
