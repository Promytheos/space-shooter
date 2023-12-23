import { Container, Sprite } from "pixi.js";
import { FALLING_OBJECTS, GameObject } from "../../types";

export class FallingObject extends Container implements GameObject {
  protected _velocity = 5;
  protected _sprite!: Sprite;
  constructor() {
    super();
    this.resetPosition();
  }

  resetPosition(): void {
    if (this._sprite) {
      this._sprite.destroy();
    }
    const index = Math.floor(Math.random() * 2);
    this._sprite = Sprite.from(FALLING_OBJECTS[index]);
    this._sprite.anchor.set(0.5);
    this.addChild(this._sprite);
    this.position.y = -200;
  }

  setVelocity(velocity: number): void {
    this._velocity = velocity;
  }

  update(delta: number): void {
    this.y += this._velocity * delta;
  }
}