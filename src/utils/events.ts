export class EventEmitter<T extends string | number | symbol> {
  private events: { [K in T]?: Array<(arg: any) => void> } = {};

  on(eventName: T, listener: (arg?: any) => void) {
    const event = this.events[eventName];
    if (event) {
        event.push(listener);
    } else {
      this.events[eventName] = [listener];
    }
  }

  emit(eventName: T, arg?: any) {
    const event = this.events[eventName];
    if (event) {
      for (const listener of event) {
        listener(arg);
      }
    }
  }
}