import { Container } from "pixi.js";
import { OBJECT_STATE } from "../../types/game-object";
import { Player, PlayerEvents } from "../../game-objects";
import { ObjectPool } from "../../utils/object-pool";
import { PlayerShot } from "../../game-objects/shots";

export class PlayerScene extends Container {
  public player: Player;
  private _shotPool: ObjectPool<PlayerShot>;
  public shots = new Set<PlayerShot>();

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

    this._shotPool.onReturn = (shot: PlayerShot) => shot.kill();

    this.player.position.x = 319;
    this.player.position.y = 900;

    this.player.onEvent(PlayerEvents.SHOOT, () => {
      const leftShot = this._shotPool.get();
      this.addChild(leftShot);
      leftShot.x = this.player.position.x - 47;
      leftShot.y = this.player.position.y - 45;
      leftShot.spawn();

      const rightShot = this._shotPool.get();
      this.addChild(rightShot);
      rightShot.x = this.player.position.x + 47;
      rightShot.y = this.player.position.y - 45;
      rightShot.spawn();

      this.shots.add(leftShot);
      this.shots.add(rightShot);
    })
  }

  update(delta: number): void {
    this.player.update(delta);

    for (const shot of this.shots) {
      if (shot.state === OBJECT_STATE.DEAD) {
        continue;
      }
      if (shot.y < 0 || shot.y < 0) {
        this.killShot(shot);
      }
      else {
        shot.update(delta);
      }
    }
  }

  killShot(shot: PlayerShot): void {
    this._shotPool.returnToPool(shot);
  }
}