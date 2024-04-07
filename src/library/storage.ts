interface StorageOperatorOptions {
  defaultValue?: Record<string, string | null>
  emitter?: EventTarget
  channel?: string
}
interface StorageMessageOptions {
  key: string
  value: string | null
  storage: Storage
}

const STORAGE_CHANNEL = 'STORAGE_CHANNEL'

class StorageOperator {
  private emitter: EventTarget
  private channel: BroadcastChannel

  constructor(
    private storage: Storage,
    options: StorageOperatorOptions = {},
  ) {
    const { emitter = new EventTarget(), channel = STORAGE_CHANNEL, defaultValue = {} } = options
    this.emitter = emitter
    this.channel = new BroadcastChannel(channel)
    for (const key in defaultValue) {
      const value = defaultValue[key]
      if (value !== null && this.storage.getItem(key) === null) {
        this.storage.setItem(key, value)
      }
    }
    this.channel.onmessage = (event) => {
      const { key, value, storage } = event.data as StorageMessageOptions
      if (this.storage === storage) {
        return
      }
      this.setItem(key, value)
    }
  }

  emit(init: StorageEventInit): void {
    const options = {
      storageArea: this.storage,
      url: window.location.href,
      ...init,
    }
    const event = new StorageEvent('storage', options)
    this.emitter.dispatchEvent(event)
  }

  on(callback: (event: StorageEvent) => void): () => void {
    const onStorage = (event: Event) => {
      if (event instanceof StorageEvent) {
        if (event.storageArea === this.storage) {
          callback(event)
        } else {
          this.storage.setItem(event.key!, event.newValue!)
        }
      }
    }
    this.emitter.addEventListener('storage', onStorage)
    return () => {
      this.emitter.removeEventListener('storage', onStorage)
    }
  }

  getItem(key: string): string | null {
    return this.storage.getItem(key)
  }

  setItem(key: string, value: string | null): void {
    const oldValue = this.storage.getItem(key)
    if (value === null) {
      this.storage.removeItem(key)
    } else {
      this.storage.setItem(key, value)
    }
    this.emit({ key, newValue: value, oldValue })
    this.channel.postMessage({
      key,
      value,
      storage: this.storage,
    } satisfies StorageMessageOptions)
  }

  removeItem(key: string): void {
    this.setItem(key, null)
  }

  clear(): void {
    Object.keys(this.storage).forEach((key) => {
      this.setItem(key, null)
    })
  }
}

export const localStorageOperator = new StorageOperator(localStorage)
export const sessionStorageOperator = new StorageOperator(sessionStorage)
