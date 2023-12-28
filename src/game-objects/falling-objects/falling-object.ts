import { Container, Sprite } from "pixi.js";
import { FALLING_OBJECTS, GameObject, OBJECT_STATE } from "../../types";

export class FallingObject extends Container implements GameObject {
  state: OBJECT_STATE = OBJECT_STATE.DEAD;
  protected _velocity = 0;
  protected _sprite!: Sprite;

  setState(state: OBJECT_STATE): void {
    this.state = state;
  }

  spawn(): void {
    this.setSprite();
    this.y = -200;
    this.setVelocity(5);
    this.setState(OBJECT_STATE.ALIVE);
  }

  kill(): void {
    this.removeChild(this._sprite);
    this.setVelocity(0);
    this.setState(OBJECT_STATE.DEAD);
  }

  setSprite(): void {
    const index = Math.floor(Math.random() * 2);
    this._sprite = Sprite.from(FALLING_OBJECTS[index]);
    this._sprite.anchor.set(0.5);
    this.addChild(this._sprite);
  }

  setVelocity(velocity: number): void {
    this._velocity = velocity;
  }

  update(delta: number): void {
    this.y += this._velocity * delta;
  }
}