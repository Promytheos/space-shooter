interface HandlerConfig {
  press?: Function;
  release?: Function;
}

export class EventHandler {
  private readonly eventMap: Record<string, Array<Function>> = {};

  /**
   * on - subscribes to an event with an action
   * @param eventName the name of the event to subscribe to
   * @param action the action to be executed when the event is fired
   */
  public on(eventName: string, action: Function): void {
    if (!this.eventMap[eventName]) {
      this.eventMap[eventName] = [];
    }
    this.eventMap[eventName].push(action);
  }

  /**
   * unsubscribe - unsubscribes a specified action from an event
   * @param eventName the name of the event that you want to unsubscribe from
   * @param action the action that you want to remove
   */
  public unsubscribe(eventName: string, action: Function): void {
    const eventIndex = this.eventMap[eventName].indexOf(action);
    if (eventIndex === -1) {
      throw new Error(`Listener for ${eventName} does not exist`);
    }
    this.eventMap[eventName].splice(eventIndex, 1);
  }

  /**
   * unsubscribeAll - unsubscribes all actions attached to an event
   * @param eventName the name of the event that you want to unsubscribe from
   */
  public unsubscribeAll(eventName: string) {
    this.eventMap[eventName] = [];
  }
 
  /**
  * emit - emits an event specified by the user and executes all actions attached to the event
  * @param eventName the name of the event to be emitted
  * @param args the arguments to be passed to the actions
  */
  public emit(eventName: string, ...args: any[]): void {
    if (this.eventMap[eventName]) {
      this.eventMap[eventName].forEach(action => action(...args));
    }
  }
}
export class KeyHandler {
    readonly value: string;
    isDown: boolean;
    isUp: boolean;
    press: Function | undefined;
    release: Function | undefined;
    downListener: (event: KeyboardEvent) => void;
    upListener: (event: KeyboardEvent) => void;

    constructor(value: string, handlerConfig: HandlerConfig = {}) {
        this.value = value;
        this.isDown = false;
        this.isUp = true;
        this.press = handlerConfig.press;
        this.release = handlerConfig.release;
        this.downListener = this.downHandler.bind(this);
        this.upListener = this.upHandler.bind(this);

        window.addEventListener("keydown", this.downListener, false);
        window.addEventListener("keyup", this.upListener, false);
    }

    downHandler(event: KeyboardEvent): void {
        if (event.key === this.value) {
          if (this.isUp && this.press) {
            this.press();
          }
          this.isDown = true;
          this.isUp = false;
          event.preventDefault();
        }
    }

    upHandler(event: KeyboardEvent): void {
        if (event.key === this.value) {
          if (this.isDown && this.release) {
            this.release();
          }
          this.isDown = false;
          this.isUp = true;
          event.preventDefault();
        }
    }

    unsubscribe() {
        window.removeEventListener("keydown", this.downListener);
        window.removeEventListener("keyup", this.upListener);
    }
}
