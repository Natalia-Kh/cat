import { defineStore } from "pinia";
import type { FoodItem, Position, GameState } from "~/types/game";

export interface GameConfig {
  levels: {
    targetScore: number;
    foodSpeed: number;
    spawnRate: number;
    catGrowth: number;
  }[];
}

const DEFAULT_CONFIG: GameConfig = {
  levels: [
    { targetScore: 3, foodSpeed: 2, spawnRate: 1000, catGrowth: 0.3 },
    { targetScore: 5, foodSpeed: 2.1, spawnRate: 900, catGrowth: 0.3 },
    { targetScore: 7, foodSpeed: 2.2, spawnRate: 800, catGrowth: 0.3 },
  ],
};

export const useGameStore = defineStore("game", {
  state: (): GameState & {
    foods: FoodItem[];
    bowlPosition: Position;
    isTabActive: boolean;
    config: GameConfig;
    foodIdCounter: number;
  } => ({
    score: 0,
    level: 1,
    isPlaying: false,
    isFeeding: false,
    isLevelComplete: false,
    targetScore: 3,
    catSize: 1,
    foods: [],
    bowlPosition: { x: 50, y: 80 },
    isTabActive: true,
    config: DEFAULT_CONFIG,
    foodIdCounter: 0,
  }),

  getters: {
    currentLevelConfig: (state) => {
      return state.config.levels[state.level - 1] || state.config.levels[0];
    },

    progressPercentage: (state) => {
      return Math.min((state.score / state.targetScore) * 100, 100);
    },

    isGameFinished: (state) => state.level > state.config.levels.length,

    rightIndentCat: (state) => {
      if (state.catSize === 1) return "2%";
      else if (state.catSize > 1.5) return `${7 * state.catSize}%`;
      else return `${5 * state.catSize}%`;
    },

    activeFoods: (state) => state.foods.filter((food) => !food.caught),
  },

  actions: {
    startGame() {
      this.isPlaying = true;
      this.score = 0;
      this.level = 1;
      this.catSize = 1;
      this.foods = [];
      this.isLevelComplete = false;
      this.isFeeding = false;
      this.foodIdCounter = 0;
      this.updateTargetScore();
    },

    restartGame() {
      this.startGame();
    },

    updateTargetScore() {
      const levelConfig = this.currentLevelConfig;
      if (levelConfig) this.targetScore = levelConfig.targetScore;
    },

    addFood(food: Omit<FoodItem, "id">) {
      const newFood: FoodItem = {
        ...food,
        id: this.foodIdCounter++,
      };
      this.foods.push(newFood);
    },

    catchFood(foodId: number) {
      const food = this.foods.find((f) => f.id === foodId);
      if (food && !food.caught) {
        food.caught = true;
        this.score++;

        if (this.score >= this.targetScore) {
          this.isLevelComplete = true;
        }
      }
    },

    removeFood(foodId: number) {
      const index = this.foods.findIndex((f) => f.id === foodId);
      if (index > -1) {
        this.foods.splice(index, 1);
      }
    },

    updateFoodPosition(foodId: number, position: Position) {
      const food = this.foods.find((f) => f.id === foodId);
      if (food) {
        food.x = position.x;
        food.y = position.y;
      }
    },

    moveBowl(position: Position) {
      this.bowlPosition = {
        x: Math.max(10, Math.min(90, position.x)),
        y: position.y,
      };
    },

    async feedCat() {
      this.isFeeding = true;
      this.isLevelComplete = false;

      // Анимация кормления
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const levelConfig = this.currentLevelConfig;
      this.catSize += levelConfig?.catGrowth || 0.3;
      this.level++;
      this.score = 0;
      this.foods = [];
      this.isFeeding = false;
      this.updateTargetScore();
    },

    setTabActive(isActive: boolean) {
      this.isTabActive = isActive;
    },

    pauseGame() {
      this.isPlaying = false;
    },

    resumeGame() {
      this.isPlaying = true;
    },

    resetGame() {
      this.$reset();
    },
  },
});
