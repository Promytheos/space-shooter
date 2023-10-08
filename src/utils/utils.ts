import { GameObject } from "../types";

export function collisionTest(objectA: GameObject, objectB: GameObject): boolean {
  const ab = objectA.getBounds();
  const bb = objectB.getBounds();
  return  !(ab.x > bb.x + bb.width ||
          ab.x + ab.width < bb.x ||
          ab.y + ab.height < bb.y ||
          ab.y > bb.y + bb.height);
}