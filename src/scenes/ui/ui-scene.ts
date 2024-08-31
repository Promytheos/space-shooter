import { Container, Text } from "pixi.js";

export class UIScene extends Container {
  constructor() {
    super();
    const label_player = new Text('Player: ', { fill: 0xffffff });
    this.addChild(label_player);
  }
}
