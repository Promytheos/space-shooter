import { Container, ObservablePoint, Sprite } from "pixi.js";
import { Effects, GameObject, OBJECT_STATE, Shot } from "../../types";
import { Tween } from "@tweenjs/tween.js";

const PLAYER_SHOT_SPEED = 50;

export class PlayerShot extends Container implements Shot {
  private _sprite: Sprite;
  private _fireTween: Tween<ObservablePoint<any>>;
  private _collisionTween: Tween<ObservablePoint<any>>;
  private _hitSprite: Sprite;
  speed: number = 0;
  state: OBJECT_STATE = OBJECT_STATE.DEAD;

  constructor() {
    super();
    this._sprite = Sprite.from(Effects.PLAYER_SHOT);
    this._sprite.anchor.set(0.5, 0);
    this._sprite.scale.set(1, 0);
    this.addChild(this._sprite);

    this._hitSprite = Sprite.from(Effects.PLAYER_HIT);
    this._hitSprite.anchor.set(0.5, 0.5);
    this.addChild(this._hitSprite);
    this._hitSprite.scale.set(0, 0);
    this._hitSprite.visible = false;

    this._fireTween = new Tween(this._sprite.scale)
    .to({ y: -1 }, 40)
    .onUpdate(({ y }) =>{
      this._sprite.scale.y = y;
    })
    .onComplete(() => {
      this.speed = PLAYER_SHOT_SPEED;
    });

    this._collisionTween = new Tween(this._hitSprite.scale)
    .to({ x: 1, y: 1 }, 40)
    .onUpdate(({ y }) =>{
      this._sprite.scale.y = y;
    });
  }

  setState(state: OBJECT_STATE): void {
    this.state = state;
  }

  spawn(): void {
    this.setState(OBJECT_STATE.ALIVE);
    this._fireTween.start();
  }

  collide(): Promise<void> {
    this.speed = 0;
    this._sprite.visible = false;
    this._hitSprite.visible = true;
    this._collisionTween.start();

    return new Promise<void>(resolve => this._collisionTween.onComplete(() => resolve()));
  }

  kill(): void {
    this.speed = 0;
    this._fireTween.stop();
    this._sprite.scale.set(1, 0);
    this._sprite.visible = true;
    this._hitSprite.visible = false;
    this.setState(OBJECT_STATE.DEAD);
  }

  update(delta: number): void {
    this.position.y -= this.speed * delta;
  }
}