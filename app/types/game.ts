export enum FoodType {
  FISH,
  MEAT,
  PIZZA,
  CHEESE,
}

export interface Position {
  x: number;
  y: number;
}

export interface FoodItem {
  id: number;
  x: number;
  y: number;
  type: FoodType;
  caught: boolean;
}

export interface GameState {
  score: number;
  level: number;
  isPlaying: boolean;
  isFeeding: boolean;
  isLevelComplete: boolean;
  targetScore: number;
  catSize: number;
}
