import { Container, Sprite } from "pixi.js";
import { FALLING_OBJECTS, GameObject } from "../../types";

export class FallingObject extends Container implements GameObject {
  protected _velocity = 0;
  protected _sprite!: Sprite;
  constructor() {
    super();
  }

  spawn(): void {
    this.setSprite();
    this.y = -200;
    this.setVelocity(5);
  }

  reset(): void {
    this.removeChild(this._sprite);
    this.setVelocity(0);
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