import { Sprite } from "pixi.js";
import { GameObject } from "../../types/game-object";
import { FallingObject } from "./falling-object";

export class Meteor extends FallingObject implements GameObject {
  protected _sprite!: Sprite;
  private _rotationSpeed!: number;
  constructor() {
    super();
    this.resetPosition();
  }

  resetPosition(): void {
    if (this._sprite) {
      this._sprite.destroy();
    }
    const spriteName = Math.random() > 0.6 ?  "objects/meteorBig.png" :  "objects/meteorSmall.png";
    this._sprite = Sprite.from(spriteName);
    this._sprite.anchor.set(0.5);
    this.addChild(this._sprite);
    this._rotationSpeed = Math.random() / 70;
  }

  update(delta: number): void {
    super.update(delta);

    this.rotation += this._rotationSpeed * delta;
  }
}