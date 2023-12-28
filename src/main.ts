import { Application } from "pixi.js";
import { FallingObject } from "./game-objects/falling-objects/falling-object";
import { ScrollingBackground } from "./scenes/background/background";
import { ObjectPool } from "./utils/object-pool";
import { KeyHandler } from "./utils/key";
import { Meteor } from "./game-objects/falling-objects/meteor";
import { update } from "@tweenjs/tween.js";
import { PlayerScene } from "./scenes/player/player-scene";
import { Direction } from "./types";
import { collisionTest } from "./utils";

export const KILL_ZONE = 1000;

export const app = new Application({
  autoDensity: true,
  width: 638,
  height: 909
});

//@ts-ignore
globalThis.__PIXI_APP__ = app;
// @ts-ignore
app.renderer.view.style.position = "absolute";
// @ts-ignore
app.renderer.view.style.display = "block";
// @ts-ignore
document.body.appendChild(app.view);
document.body.style.backgroundColor = "#777777";
document.body.style.margin = "0px";

const activeObjects = new Set<FallingObject>();
let spawnCounter = 0;
let spawnThreshold = 0;
const background = new ScrollingBackground();
app.stage.addChild(background);
const objectPool: ObjectPool<FallingObject> = new ObjectPool(
  'falling-object-pool',
  createFallingObject,
  {
    initialSize: 10,
    maxSize: 20
  },
  (object: FallingObject) => {
    object.visible = false;
    object.setVelocity(0);
    object.reset();
  }
);

function createFallingObject(): FallingObject {
  const object = Math.random() > 0.55 ? new FallingObject() : new Meteor();
  return object;
}

let gameOver = false;

function spawnObject(): void {
  spawnCounter = 0;
  spawnThreshold = Math.random() * 100;
  const object = objectPool.get();
  object.spawn();
  object.visible = true;
  object.x = Math.floor(Math.random() * (app.screen.width - object.width));
  activeObjects.add(object);
  app.stage.addChild(object);
}

function killObject(object: FallingObject): void {
  objectPool.returnToPool(object);
  activeObjects.delete(object);
  app.stage.removeChild(object);
}

registerInputs();

const playerScene = new PlayerScene();
app.stage.addChild(playerScene);

app.ticker.add((delta) => {
  if (gameOver) {
    return;
  }
  playerScene.update(delta);
  update();
  background.update(delta);
  spawnCounter += delta;

  if (spawnCounter > spawnThreshold) {
    // spawnObject();
  }

  for (const object of activeObjects) {
    if (collisionTest(object, playerScene.player)) {
      gameOver = true;
      console.log('COLLISION WITH PLAYER');
    }
    else {
      if (object.y > KILL_ZONE) {
        console.log('OBJECT OFF SCREEN');
        killObject(object);
      }
      else {
        object.update(delta)
      }
    }

    playerScene.shots.forEach((shot, index) => {
      if (collisionTest(object, shot.left)) {
        console.log('OBJECT COLLIDED WITH LEFT SHOT');
        shot.left.collide()
        .then(() => {
            killObject(object);
            playerScene.killShot(shot);
          });
      }
      else if (collisionTest(object, shot.right)) {
        console.log('OBJECT COLLIDED WITH RIGHT SHOT');
        shot.right.collide()
        .then(() => {
            killObject(object);
            playerScene.killShot(shot);
          });
      }
    });
  }
});

const speeds = [0, 1/16, 1/4, 1/2, 1, 2, 4, 16];
let speedIndex = 4;
app.ticker.speed = speeds[speedIndex];

function registerInputs(): void {
  new KeyHandler("ArrowLeft", {
    press: () => playerScene.player.move(Direction.LEFT),
    release: () => playerScene.player.stop()
  });

  new KeyHandler("ArrowRight", {
    press: () => playerScene.player.move(Direction.RIGHT),
    release: () => playerScene.player.stop()
  });

  new KeyHandler(" ", {
    press: () => playerScene.player.shoot()
  });

  new KeyHandler("-", {
    press: () => {
      if (speedIndex > 0) {
        speedIndex--;
        app.ticker.speed = speeds[speedIndex];
      }
    }
  });

  new KeyHandler("+", {
    press: () => {
      if (speedIndex < speeds.length - 1) {
        speedIndex++;
        app.ticker.speed = speeds[speedIndex];
      }
    }
  });
}