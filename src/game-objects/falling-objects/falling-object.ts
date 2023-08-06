import { Container, Sprite } from "pixi.js";
import { FallingObjects } from "../../types";
import { KILL_ZONE, app } from "../../main";
import { GameObject } from "../../types/game-object";

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
    this._sprite = Sprite.from(FallingObjects[index]);
    this._sprite.anchor.set(0.5);
    this.addChild(this._sprite);
  }

  update(delta: number): void {
    this.y += this._velocity * delta;
  }

  isCollidingWith(object: GameObject) {
    const ab = this.getBounds();
    const bb = object.getBounds();
    return false;
    // return  !(ab.x > bb.x + bb.width ||
    //         ab.x + ab.width < bb.x ||
    //         ab.y + ab.height < bb.y ||
    //         ab.y > bb.y + bb.height);
  }
}