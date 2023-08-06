import { Container } from "pixi.js";
import { GameObject } from "../../types/game-object";
import { Player, PlayerEvents } from "../../game-objects";
import { ObjectPool } from "../../utils/object-pool";
import { PlayerShot } from "../../game-objects/shots";

export class PlayerScene extends Container {
  public objects: Array<GameObject> = [];
  public player: Player;
  private _shotPool: ObjectPool<PlayerShot>;
  public shots: Array<PlayerShot> = [];

  constructor() {
    super();
    this.player = new Player();
    this.addChild(this.player);

    this._shotPool = new ObjectPool<PlayerShot>(
      'shot-pool',
      () => {
        return new PlayerShot();
      },
      {
        initialSize: 10,
        autoIncrease: false,
        maxSize: 10
      }
    );

    this._shotPool.onReturn = (shot: PlayerShot) => {
      shot.reset();
      this.removeChild(shot);
    }

    this.player.position.x = 319;
    this.player.position.y = 900;

    this.player.onEvent(PlayerEvents.SHOOT, () => {
      const leftShot = this._shotPool.get();
      this.addChild(leftShot);
      this.shots.push(leftShot);
      leftShot.x = this.player.position.x - 45;
      leftShot.y = this.player.position.y - 45;
      leftShot.fire();
      const rightShot = this._shotPool.get();
      this.addChild(rightShot);
      this.shots.push(rightShot);
      rightShot.x = this.player.position.x + 45;
      rightShot.y = this.player.position.y - 45;
      rightShot.fire();
    })
  }

  update(delta: number): void {
    this.player.update(delta);

    this.shots.forEach((shot, index) => {
      if (shot.y < 0) {
        this._shotPool.returnToPool(shot);
        this.shots.splice(index, 1);
      }
      else {
        shot.update(delta);
      }
    });

    for (const object of this.objects) {
      object.update(delta);
    }
  }
}