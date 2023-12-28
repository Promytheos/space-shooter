import { Container } from "pixi.js";

export const enum OBJECT_STATE {
  'ALIVE',
  'DEAD'
}

export interface GameObject extends Container {
  update(delta?: number): void;
  state: OBJECT_STATE;
  setState(state: OBJECT_STATE): void;
  spawn(): void;
  kill(): void;
}