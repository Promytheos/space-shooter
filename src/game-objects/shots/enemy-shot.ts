import { Container, Sprite } from "pixi.js";
import { Effects, GameObject, OBJECT_STATE, Shot } from "../../types";

export class EnemyShot extends Container implements Shot, GameObject {
  state: OBJECT_STATE = OBJECT_STATE.DEAD;
  constructor(public readonly speed: number) {
    super();
    const sprite = Sprite.from(Effects.ENEMY_SHOT);
    sprite.anchor.set(0.5, 0);
  }

  setState(state: OBJECT_STATE): void {
    this.state = state;
  }

  spawn(): void {
    throw new Error("Method not implemented.");
  }

  kill(): void {
    throw new Error("Method not implemented.");
  }

  update(delta: number): void {
    this.position.y += this.speed * delta;
  }
}