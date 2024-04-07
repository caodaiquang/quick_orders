/* eslint-disable prefer-spread */
/* eslint-disable no-underscore-dangle */
export default class EventEmitter {
  private _listeners: { [key: string]: Set<Function> }
  constructor() {
    this._listeners = Object.create(null)
  }

  /**
   * @param {string} eventName
   * @param {function} listener
   */
  addListener(eventName: string, listener: Function) {
    this._on(eventName, listener)
  }

  /**
   * @param {string} eventName
   * @param {function} listener
   */
  removeListener(eventName: string, listener: Function) {
    this._off(eventName, listener)
  }

  /**
   * Remove all the listener that exist in the channel
   */
  removeAllListener() {
    this._listeners = Object.create(null)
  }

  emit(eventName: string, ...args: any[]) {
    const eventListeners = this._listeners[eventName] ?? []
    // Passing all arguments after the eventName to the listeners.
    eventListeners.forEach((listener: Function) => {
      Reflect.apply(listener, null, args)
    })
  }

  /**
   * @ignore
   */
  _on(eventName: string, listener: Function) {
    let eventListeners = this._listeners[eventName]
    if (!eventListeners) {
      this._listeners[eventName] = new Set()
      eventListeners = new Set()
    }
    this._listeners[eventName] = eventListeners.add(listener)
  }

  /**
   * @ignore
   */
  _off(eventName: string, listener: Function) {
    const eventListeners = this._listeners[eventName]
    if (!eventListeners) {
      return
    }
    eventListeners.delete(listener)
    this._listeners[eventName] = eventListeners
  }
}
