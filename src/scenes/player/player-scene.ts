import { Container } from "pixi.js";
import { GameObject } from "../../types/game-object";
import { Player, PlayerEvents } from "../../game-objects";
import { ObjectPool } from "../../utils/object-pool";
import { PlayerShot } from "../../game-objects/shots";

export type ShotPair = { left: PlayerShot, right: PlayerShot };

export class PlayerScene extends Container {
  public objects: Array<GameObject> = [];
  public player: Player;
  private _shotPool: ObjectPool<PlayerShot>;
  public shots = new Set<ShotPair>();

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
      leftShot.x = this.player.position.x - 47;
      leftShot.y = this.player.position.y - 45;
      leftShot.fire();
      const rightShot = this._shotPool.get();
      this.addChild(rightShot);
      rightShot.x = this.player.position.x + 47;
      rightShot.y = this.player.position.y - 45;
      rightShot.fire();

      this.shots.add({
        left: leftShot,
        right: rightShot
      });
    })
  }

  update(delta: number): void {
    this.player.update(delta);

    for (const shot of this.shots) {
      if (shot.left.y < 0) {
        this.killShot(shot);
      }
      else {
        shot.left.update(delta);
        shot.right.update(delta);
      }
    }

    for (const object of this.objects) {
      object.update(delta);
    }
  }

  killShot(shot: ShotPair): void {
    this._shotPool.returnToPool(shot.left);
    this._shotPool.returnToPool(shot.right);
    this.shots.delete(shot);
  }
}