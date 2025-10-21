export enum FoodType {
  FISH = 'fish',
  MEAT = 'meat',
  PIZZA = 'pizza',
  CHEESE = 'cheese',
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
  speed?: number;
  rotation?: number;
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

export interface GameConfig {
  levels: LevelConfig[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LevelConfig {
  targetScore: number;
  foodSpeed: number;
  spawnRate: number;
  catGrowth: number;
  maxFoods?: number;
}

export interface GameStats {
  totalScore: number;
  levelsCompleted: number;
  bestScore: number;
  playTime: number;
}

export type GameEvent = 
  | 'game_start'
  | 'game_pause'
  | 'game_resume'
  | 'level_complete'
  | 'game_complete'
  | 'food_caught'
  | 'food_missed'
  | 'cat_fed';
