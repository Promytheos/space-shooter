interface HandlerConfig {
  press?: Function;
  release?: Function;
}

// TODO: Refactor to handle multiple events
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
