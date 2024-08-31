import { Application, Ticker } from "pixi.js";
import { FallingObject } from "./game-objects/falling-objects/falling-object";
import { ScrollingBackground } from "./scenes/background/background";
import { KeyHandler } from "./utils/key";
import { update } from "@tweenjs/tween.js";
import { GameplayScene } from "./scenes/player/gameplay-scene";
import { Direction, OBJECT_STATE } from "./types";
import { collisionTest } from "./utils";
import { UIScene } from "./scenes/ui/ui-scene";

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

const background = new ScrollingBackground();
app.stage.addChild(background);

const playerScene = new GameplayScene();
app.stage.addChild(playerScene);

app.stage.addChild(new UIScene());

let gameOver = false;

registerInputs();


Ticker.shared.add(() => {
  if (gameOver) {
    Ticker.shared.stop();
  }

  update(); // Tween
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
