import { GameObject } from "../types";

export function collisionTest(objectA: GameObject, objectB: GameObject): boolean {
  const ab = objectA.getBounds();
  const bb = objectB.getBounds();
  const hasCollided = !(ab.x > bb.x + bb.width ||
          ab.x + ab.width < bb.x ||
          ab.y + ab.height < bb.y ||
          ab.y > bb.y + bb.height);

  if (hasCollided && (!objectA.visible || !objectB.visible)) {
    if (!objectA.visible) {
      console.log(objectA);
    }
    if (!objectB.visible) {
      console.log(objectB);
    }
    throw new Error(`Collision with invisible object`);
  }

  return hasCollided;
}