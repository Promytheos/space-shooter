import { Application, Sprite } from "pixi.js";
import { Player } from "./game-objects/player";
import { FallingObject } from "./game-objects/falling-objects/falling-object";
import { GameObject } from "./types/game-object";
import { ScrollingBackground } from "./scenes/background/background";
import { ObjectPool } from "./utils/object-pool";
import { Key } from "./utils/key";
import { Meteor } from "./game-objects/falling-objects/meteor";
import { update } from "@tweenjs/tween.js";
import { PlayerScene } from "./scenes/player/player-scene";
import { Direction, Effects, PlayerStates } from "./types";

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

const activeObjects: Array<FallingObject> = [];
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
  activeObjects.push(object);
  app.stage.addChild(object);
  object.position.x = Math.floor(Math.random() * (app.screen.width - object.width));
  object.position.y = -200;
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
    spawnObject();
  }

  for (const object of activeObjects) {
    if (object.isCollidingWith(playerScene.player)) {
      gameOver = true;
    }
    else {
      if (object.y > KILL_ZONE) {
        object.resetPosition();
        objectPool.returnToPool(object);
        activeObjects.splice(activeObjects.indexOf(object), 1);
      }
      else {
        object.update(delta)
      }
    }
  }
});

const speeds = [0, 1/16, 1/4, 1/2, 1, 2, 4, 16];
let speedIndex = 4;
app.ticker.speed = speeds[speedIndex];

function registerInputs(): void {
  const left = new Key("ArrowLeft");

  left.press = () => {
    playerScene.player.move(Direction.LEFT);
  }

  left.release = () => {
    playerScene.player.stop();
  }

  const right = new Key("ArrowRight");

  right.press = () => {
    playerScene.player.move(Direction.RIGHT);
  }

  right.release = () => {
    playerScene.player.stop();
  }

  const space = new Key(" ");
  space.press = () => {
    playerScene.player.shoot();
  };


  const minus = new Key("-");
  const plus = new Key("+");
  minus.press = () => {
    if (speedIndex > 0) {
      speedIndex--;
      app.ticker.speed = speeds[speedIndex];
    }
  }

  plus.press = () => {
    if (speedIndex < speeds.length - 1) {
      speedIndex++;
      app.ticker.speed = speeds[speedIndex];
    }
  }
}