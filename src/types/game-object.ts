import { Container } from "pixi.js";

export interface GameObject extends Container {
  update(delta?: number): void;
}