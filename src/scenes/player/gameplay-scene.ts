import { Container, Ticker } from "pixi.js";
import { OBJECT_STATE } from "../../types/game-object";
import { FallingObject, Meteor, Player, PlayerEvents } from "../../game-objects";
import { ObjectPool } from "../../utils/object-pool";
import { PlayerShot } from "../../game-objects/shots";
import { collisionTest } from "../../utils";
import { KILL_ZONE } from "../../main";

export class GameplayScene extends Container {
  public player: Player;
  private _shotPool: ObjectPool<PlayerShot>;
  public shots = new Set<PlayerShot>();

  private _fallingObjects = new Set<FallingObject>();
  private _objectsToReturn = new Set<FallingObject>();
  private _spawnCounter = 0;
  private _spawnThreshold = 0;

  private _objectPool: ObjectPool<FallingObject> = new ObjectPool(
    'falling-object-pool',
    this.createFallingObject.bind(this),
    {
      initialSize: 10,
      maxSize: 20
    },
    (object: FallingObject) => this.killObject(object)
  );

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
    });

    Ticker.shared.add(this.update.bind(this));
  }

  createFallingObject(): FallingObject {
    const object = Math.random() > 0.55 ? new FallingObject() : new Meteor();
    this._fallingObjects.add(object);
    return object;
  }

  spawnObject(): void {
    this._spawnCounter = 0;
    this._spawnThreshold = Math.random() * 100;
    const object = this._objectPool.get();
    object.spawn();
    object.visible = true;
    object.x = Math.floor(Math.random() * (this.width - object.width));
    this.addChild(object);
  }

  killObject(object: FallingObject): void {
    this.removeChild(object);
    object.visible = false;
    object.kill();
  }

  update(delta: number): void {
    this.player.update(delta);
    this._spawnCounter += delta;

    if (this._spawnCounter > this._spawnThreshold) {
      this.spawnObject();
    }

    for (const object of this._fallingObjects) {
      if (object.state === OBJECT_STATE.DEAD) {
        continue;
      }
      if (collisionTest(object, this.player)) {
        // gameOver = true;
      }
      else {
        if (object.y > KILL_ZONE) {
          this._objectsToReturn.add(object);
        }
        else {
          object.update(delta)
        }
      }

      for (const shot of this.shots) {
        if (shot.state === OBJECT_STATE.DEAD) {
          continue;
        }
        if (collisionTest(object, shot)) {
          shot.setState(OBJECT_STATE.DEAD);
          object.setState(OBJECT_STATE.DEAD);
          shot.collide()
            .then(() => {
              this._objectsToReturn.add(object);
              this.killShot(shot);
            });
        }
      }
    }

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

    for (const object of this._objectsToReturn) {
      this._objectPool.returnToPool(object);
    }
    this._objectsToReturn.clear();
  }

  killShot(shot: PlayerShot): void {
    this._shotPool.returnToPool(shot);
  }
}
