export const enum Direction {
  LEFT = "left",
  RIGHT = "right"
}

export const FallingObjects: ReadonlyArray<string> = [
  "characters/enemyShip.png",
  "characters/enemyUFO.png"
];

export const PlayerStates: Record<string, string> = {
  "idle": "characters/player.png",
  "left": "characters/playerLeft.png",
  "right": "characters/playerRight.png",
}

export const enum Effects {
  PLAYER_SHOT = "effects/laserRed.png",
  PLAYER_HIT = "effects/laserRedShot.png",
  ENEMY_SHOT = "effects/laserGreen.png",
  ENEMY_HIT = "effects/laserGreenShot.png"
}

export const Background_Color = 'backgrounds/backgroundColor.png';

export interface PoolObject {
  reset(): void;
}