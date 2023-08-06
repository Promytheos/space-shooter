import { Container, ObservablePoint, Sprite } from "pixi.js";
import { Effects, GameObject, Shot } from "../../types";
import { Tween } from "@tweenjs/tween.js";

const PLAYER_SHOT_SPEED = 50;

export class PlayerShot extends Container implements GameObject, Shot {
  private _sprite: Sprite;
  private _fireTween: Tween<ObservablePoint<any>>;
  speed: number = 0;
  constructor() {
    super();
    this._sprite = Sprite.from(Effects.PLAYER_SHOT);
    this._sprite.anchor.set(0.5, 0);
    this._sprite.scale.set(1, 0);
    this.addChild(this._sprite);

    this._fireTween = new Tween(this._sprite.scale)
    .to({ y: -1 }, 40)
    .onUpdate(({ y }) =>{
      this._sprite.scale.y = y;
    })
    .onComplete(() => {
      this.speed = PLAYER_SHOT_SPEED;
    });
  }

  fire(): void {
    this._fireTween.start();
  }

  reset(): void {
    this.speed = 0;
    this._fireTween.stop();
    this._sprite.scale.set(1, 0);
  }

  update(delta: number): void {
    this.position.y -= this.speed * delta;
  }
}