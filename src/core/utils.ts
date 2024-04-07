export type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export type IsFunction = (...args: any[]) => boolean;

export type AnyFunction = (...args: any[]) => any;

export type EventFunction = (...args: any[]) => void;

export type Unsubscribe = () => void;
