import { AnyFunction, IsFunction } from '@/core/utils'
import { EventEmitter } from 'events'

type QueryMap = Record<string, [IsFunction, IsFunction]>

type QueryResponseError<T extends QueryMap, K extends keyof T> = {
  type: K
  error: Error
}

type QueryResponse<T extends QueryMap, K extends keyof T> = {
  type: K
  payload: Parameters<T[K][1]>[0]
}

type QueryRequest<T extends QueryMap, K extends keyof T> = {
  type: K
  payload: Parameters<T[K][0]>
}

type QueryParams<T extends QueryMap, K extends keyof T> =
  | QueryResponse<T, K>
  | QueryResponseError<T, K>


const REQUEST = 'query_request'
const RESPONSE = 'query_response'

export type GetQueryMap<T> = T extends QueryBus<infer M> ? M : never

export class QueryBus<M extends QueryMap> {
  emitter = new EventEmitter()
  controllers: Record<keyof M, AnyFunction[]>
  schema: M

  constructor(map: M) {
    this.schema = map
    this.controllers = {} as Record<keyof M, AnyFunction[]>
    for (const key in map) {
      this.controllers[key] = []
    }
  }

  has<T extends keyof M>(type: T): type is T {
    return this.controllers[type].length > 0
  }

  query<T extends keyof M>(
    type: T,
    ...params: Parameters<M[T][0]>
  ): Promise<Awaited<Parameters<M[T][1]>[0]>> &{ abort: () => void } {
    let abort: (() => void) = () => {}
    const promise: any = new Promise((resolve, reject) => {
      try {
        if (this.emitter.listeners(REQUEST).length === 0) {
          throw new Error(`No listener for ${String(type)} query.`)
        }
        const isParams = this.schema[type][0]
        const isReturn = this.schema[type][1]
        const onQueryResponse = (data: QueryParams<M, T>) => {
          if (data.type === type && 'payload' in data) {
            if (isReturn(data.payload)) {
              resolve(data.payload)
            }
            throw new Error(`Invalid return for ${String(type)} query.`)
          }
          if (data.type === type && 'error' in data) {
            reject(data.error)
          }
        }
        this.emitter.once(RESPONSE, onQueryResponse)
        abort = () => {
          this.emitter.off(RESPONSE, onQueryResponse)
        }
        if (isParams(...params)) {
          this.emitter.emit(REQUEST, { type, payload: params })
        }
        throw new Error(`Invalid params for ${String(type)} query.`)
      } catch (error) {
        reject(error)
        abort?.()
      }
    })
    promise.abort = abort
    return promise
  }

  listen<T extends keyof M>(
    type: T,
    controller: (...params: Parameters<M[T][0]>) => Parameters<M[T][1]>[0],
  ): () => void {
    const onQuery = (data: QueryRequest<M, T>) => {
      if (data.type === type) {
        const result = controller(...data.payload)
        this.emitter.emit(RESPONSE, { type, payload: result })
      }
    }
    this.controllers[type] = this.controllers[type].concat(controller)
    this.emitter.on(REQUEST, onQuery)
    return () => {
      this.controllers[type] = this.controllers[type].filter((c) => c !== controller)
      this.emitter.off(REQUEST, onQuery)
    }
  }
}
