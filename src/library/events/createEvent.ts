import { EventMethods } from "../../core/events"
import { AnyFunction, EventFunction, IsFunction } from "../../core/utils"

class EventBus {
  #queue: Record<string, EventFunction[] | undefined> = {};
  #map: WeakMap<EventFunction, EventFunction> = new WeakMap();

  #set(event: string, callback: EventFunction): void {
    const queue = this.#queue[event];
    if (queue) {
      this.#queue[event] = queue.concat(callback);
    } else {
      this.#queue[event] = [callback];
    }
  }

  #remove(event: string, callback: EventFunction): void {
    const queue = this.#queue[event];
    if (queue) {
      this.#queue[event] = queue.filter((cb) => cb !== callback);
      this.#map.delete(callback);
    }
  }

  on(event: string, listener: (...args: any[]) => void, once = false): () => void {
    const callback = (...args: any[]): void => {
      listener(...args);
      if (once) {
        this.#remove(event, callback);
      }
    };
    this.#set(event, callback);
    this.#map.set(listener, callback);
    let isOff = false;
    return () => {
      if (isOff) return;
      this.#remove(event, callback);
      isOff = true;
    };
  }

  off(event: string, listener: EventFunction): void {
    const callback = this.#map.get(listener);
    if (callback) {
      this.#remove(event, callback);
    }
  }

  emit(event: string, ...args: any[]): void {
    const queue = this.#queue[event];
    if (queue) {
      queue.forEach((cb) => cb(...args));
    }
  }

  eventCount(event: string): number {
    return this.#queue[event]?.length ?? 0;
  }

  eventNames(): string[] {
    return Object.keys(this.#queue);
  }

  getListeners(event: string): EventFunction[] {
    return this.#queue[event] ?? [];
  }
}


export function createEvent<T extends Record<string, IsFunction>>(defines: T): EventMethods<T> {
  const eventDefines = { ...defines } as { [K in keyof T]: T[K] }
  const eventBus = new EventBus()
  return {
    on: (name, callback) => {
      return eventBus.on(name as string, callback as AnyFunction)
    },
    once: (name, callback) => {
      return eventBus.on(name as string, callback as AnyFunction, true)
    },
    off: (name, callback) => {
      return eventBus.off(name as string, callback as AnyFunction)
    },
    emit: (name, ...args) => {
      const isParams = eventDefines[name as keyof T]
      if (isParams(...args)) {
        return eventBus.emit(name as string, ...args)
      }
      throw new Error(`Event "${String(name)}" params not match`)
    },
    eventCount: (name) => {
      return eventBus.eventCount(name as string)
    },
    eventNames: () => {
      return eventBus.eventNames()
    },
    getListeners: (name) => {
      return eventBus.getListeners(name as string)
    },
    addEvents: (events) => {
      Object.keys(events).forEach((name) => {
        eventDefines[name as keyof T] = events[name as keyof T]
      })
    }
  }
}
