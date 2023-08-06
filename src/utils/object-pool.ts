import { PoolObject } from "../types";

export interface ObjectPoolConfig {
  initialSize?: number;
  maxSize?: number;
  autoIncrease?: boolean;
}

/**
 * Creates an Object Pool which can be initialised with optional config. maxSize is 100 by default and autoIncrease is true by default.
 * @constructor
 * @param {string} name - the name of the object pool (useful for debugging)
 * @param {ObjectPoolConfig} poolConfig - optional config to set up the pool
 * @param {number} [poolConfig.initialSize=0] default=0 - if this is set, the object pool will be initialised with this many objects in it
 * @param {number} [poolConfig.maxSize=100] default=100 - if this is set, the object pool will not create more objects than this amount, a warning will be thrown if this is attempted. Ignored if autoIncrease is supplied
 * @param {boolean} [poolConfig.autoIncrease=true] default=true - decides whether the pool should create more objects than the initialSize or the maxSize (depending on which is supplied)
 */
export class ObjectPool<T> {
  private readonly _initialSize: number;
  private readonly _maxSize: number;
  private readonly _autoIncrease: boolean;
  private _pool: Array<T> = [];
  add: () => T;
  onReturn?: (arg: T) => void;
  public size: number = 0;

  constructor(
    public readonly name: string,
    createFn: () => T,
    poolConfig: ObjectPoolConfig = {}
  ) {
    this.add = createFn;
    const {
      initialSize = 0,
      maxSize = 100,
      autoIncrease = false
    } = poolConfig;

    this._initialSize = initialSize;
    this.size = this._initialSize;
    this._maxSize = maxSize;
    this._autoIncrease = autoIncrease;

    this._initialise();
  }

  private _initialise(): void {
    for (let i = 0; i < this._initialSize; i++) {
      const object = this.add();
      this._pool.push(object);
    }
  }

  returnToPool(object: T): void {
    if (this.onReturn) {
      this.onReturn(object);
    }
    this._pool.push(object);
  }

  get(): T {
    if (this._pool.length > 0) {
      const object = this._pool.pop();
      if (object === undefined) {
        throw new Error(`[${this.name}]: Object from pool is undefined`);
      }
      return object;
    }
    else {
      if (this.size >= this._maxSize && !this._autoIncrease) {
        throw new Error(`[${this.name}]: Pool Limit Reached`);
      }
      else {
        this.size++;
        console.warn(`[${this.name}]: Creating new object in Pool. Size: ${this.size}`);

        return this.add();
      }
    }
  }
}