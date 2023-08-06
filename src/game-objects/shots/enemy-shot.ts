import { Container, Sprite } from "pixi.js";
import { Effects, GameObject, Shot } from "../../types";

export class EnemyShot extends Container implements Shot, GameObject {
  constructor(public readonly speed: number) {
    super();
    const sprite = Sprite.from(Effects.ENEMY_SHOT);
    sprite.anchor.set(0.5, 0);
  }

  update(delta: number): void {
    this.position.y += this.speed * delta;
  }
}