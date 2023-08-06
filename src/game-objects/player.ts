import { Container, Sprite } from "pixi.js";
import { Direction, PlayerStates, Shot } from "../types";
import { app } from "../main";
import { EventEmitter } from "../utils/events";

export const enum PlayerEvents {
  SHOOT = 'shoot'
}

export class Player extends Container {
  private _velocity: number = 0;
  private _sprite: Sprite;
  public shots: Array<Shot> = [];
  private _eventEmitter = new EventEmitter<PlayerEvents>();

  constructor() {
    super();
    this._sprite = Sprite.from(PlayerStates.idle);
    this._sprite.anchor.set(0.5, 1);
    this.addChild(this._sprite);
  }

  shoot(): void {
    this._eventEmitter.emit(PlayerEvents.SHOOT);
  }

  move(direction: Direction) {
    switch (direction) {
      case Direction.LEFT:
        this.updateSprite(PlayerStates.left);
        this._velocity = -5;
        break;

      case Direction.RIGHT:
        this.updateSprite(PlayerStates.right);
        this._velocity = 5;
        break;
    }
  }

  stop() {
    this.updateSprite(PlayerStates.idle);
    this._velocity = 0;
  }

  onEvent(event: PlayerEvents, listener: (arg: any) => void): void {
    this._eventEmitter.on(event, listener);
  }

  updateSprite(name: string) {
    this.removeChild(this._sprite);
    this._sprite = Sprite.from(name);
    this._sprite.anchor.set(0.5, 1);
    this.addChild(this._sprite);
  }

  update(delta: number) {
    this.x += this._velocity * delta;
    if (this.x > app.screen.width) {
      this.stop();
      this.x = app.screen.width;
    }
    else if (this.x < 0) {
      this.stop();
      this.x = 0;
    }
  }
}