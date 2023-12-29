import { Application } from "pixi.js";
import { FallingObject } from "./game-objects/falling-objects/falling-object";
import { ScrollingBackground } from "./scenes/background/background";
import { ObjectPool } from "./utils/object-pool";
import { KeyHandler } from "./utils/key";
import { Meteor } from "./game-objects/falling-objects/meteor";
import { update } from "@tweenjs/tween.js";
import { PlayerScene } from "./scenes/player/player-scene";
import { Direction, OBJECT_STATE } from "./types";
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

const fallingObjects = new Set<FallingObject>();
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
  (object: FallingObject) => killObject(object)
);

function createFallingObject(): FallingObject {
  const object = Math.random() > 0.55 ? new FallingObject() : new Meteor();
  fallingObjects.add(object);
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
  app.stage.addChild(object);
}

function killObject(object: FallingObject): void {
  app.stage.removeChild(object);
  object.visible = false;
  object.kill();
}

registerInputs();

const playerScene = new PlayerScene();
app.stage.addChild(playerScene);
const objectsToReturn = new Set<FallingObject>();

app.ticker.add((delta) => {
  if (gameOver) {
    return;
  }

  playerScene.update(delta);
  update();
  background.update(delta);
  spawnCounter += delta;

  if (spawnCounter > spawnThreshold) {
    spawnObject();
  }

  for (const object of fallingObjects) {
    if (object.state === OBJECT_STATE.DEAD) {
      continue;
    }
    if (collisionTest(object, playerScene.player)) {
      gameOver = true;
    }
    else {
      if (object.y > KILL_ZONE) {
        objectsToReturn.add(object);
      }
      else {
        object.update(delta)
      }
    }

    for (const shot of playerScene.shots) {
      if (shot.state === OBJECT_STATE.DEAD) {
        continue;
      }
      if (collisionTest(object, shot)) {
        shot.setState(OBJECT_STATE.DEAD);
        object.setState(OBJECT_STATE.DEAD);
        shot.collide()
        .then(() => {
            objectsToReturn.add(object);
            playerScene.killShot(shot);
          });
      }
    }
  }

  for (const object of objectsToReturn) {
    objectPool.returnToPool(object);
  }
  objectsToReturn.clear();
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