import { Container, Point, Sprite } from "pixi.js";
import { Background_Color } from "../../types";
import { ObjectPool } from "../../utils/object-pool";
import { KILL_ZONE, app } from "../../main";

export class ScrollingBackground extends Container {
  private readonly _bg: Sprite;
  private _scrollingObjects: Array<Sprite> = [];
  private _starPool: ObjectPool<Sprite>;
  private _cloudPool: ObjectPool<Sprite>;
  private _scrollingSpeed = 3;
  private _spawnCounter = 0;
  private _spawnThreshold = 0;

  constructor() {
    super();
    this.name = 'background';
    this._bg = Sprite.from(Background_Color);
    this.addChild(this._bg);
    this._bg.width = 638;
    this._bg.height = 909;

    this._cloudPool = new ObjectPool<Sprite>(
      'cloud-pool',
      this.getCloud,
      { initialSize: 5 }
    );

    this._cloudPool.onReturn = (cloud: Sprite) => {
      this.removeChild(cloud);
    };

    this._starPool = new ObjectPool<Sprite>(
      'star-pool',
      this.getStar,
      { initialSize: 5 }
    );

    this._starPool.onReturn = (star: Sprite) => {
      this.removeChild(star);
    };
  }

  getCloud(): Sprite {
    const cloud = Sprite.from('backgrounds/nebula.png');
    return cloud;
  }

  getStar(): Sprite {
    if (Math.random() > 0.75) {
      return Sprite.from('backgrounds/starBig.png');
    }
    else {
      return Sprite.from('backgrounds/starSmall.png');
    }
  }

  addObject(): void {
    const x = Math.random() * app.screen.width;
    const y = -200;
    const isCloud = Math.random() > 0.75;
    const object = isCloud ?
      this._cloudPool.get() :
      this._starPool.get();
    if (isCloud) {
      object.name = 'cloud';
    }
    else {
      object.name = 'star';
    }
    this._scrollingObjects.push(object);
    object.position.set(x, y);
    this.addChild(object);
  }

  update(delta: number): void {
    this._spawnCounter += delta;

    // If the spawn counter exceeds the spawn threshold, spawn a new object
    if (this._spawnCounter > this._spawnThreshold) {
        // Reset the spawn counter and threshold
        this._spawnCounter = 0;
        this._spawnThreshold = Math.random() * 60;
        this.addObject();
    }

    for (const object of this._scrollingObjects) {
      if (object.y > KILL_ZONE) {
        if (object.name == 'cloud') {
          this._cloudPool.returnToPool(object);
          this._scrollingObjects.splice(this._scrollingObjects.indexOf(object), 1);
        }
        else {
          this._starPool.returnToPool(object);
          this._scrollingObjects.splice(this._scrollingObjects.indexOf(object), 1);
        }
      }
      object.y += this._scrollingSpeed * delta;
    }
  }
}