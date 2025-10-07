<template>
  <div class="game">
    <div class="game-container">
      <div class="game-header">
        <h1>Накорми кота!</h1>
        <div v-if="!isFinish" class="game-stats">
          <div class="stat">Уровень: {{ level }}</div>
          <div class="stat">Счёт: {{ score }}/{{ targetScore }}</div>
        </div>
      </div>
      <div class="game-controls">
        <div v-if="!isPlaying" class="start-screen">
          <button @click="startGame" class="btn btn--full">Начать игру</button>
        </div>
        <div
          v-if="isPlaying && !isLevelComplete && !isFeeding && !isFinish"
          class="feeding-animation"
        >
          <p>Лови корм</p>
        </div>
        <div v-if="isLevelComplete && isPlaying" class="level-complete">
          <button @click="feedCat" class="btn btn--white">
            Накормить кота!
          </button>
        </div>

        <div v-if="isFeeding" class="feeding-animation">
          <p>Кот ест...</p>
        </div>

        <div v-if="isFinish" class="game-complete">
          <h2>Поздравляем! Вы прошли все уровни!</h2>
          <button @click="restartGame" class="btn btn--full">
            Играть снова
          </button>
        </div>
      </div>

      <div class="game-area" @mousemove="moveBowl" @touchmove="moveBowlTouch">
        <GameCat
          :size="catSize"
          :isFeeding="isFeeding"
          class="cat"
          :style="{
            bottom: `${40 * catSize}px`,
            right: rightIndentCat,
          }"
        />

        <GameBowl
          :position="bowlPosition"
          :score="score"
          :targetScore="targetScore"
          class="bowl"
        />

        <GameFood
          v-for="food in foods"
          :key="food.id"
          :position="{ x: food.x, y: food.y }"
          :type="food.type"
          :caught="food.caught"
          class="food"
        />
      </div>

      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      <NuxtLink to="/" class="btn"> Вернуться на главную </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

import { type FoodItem, type Position, FoodType } from "~/types/game";

const isPlaying = ref(false);
const isFeeding = ref(false);
const isLevelComplete = ref(false);
const level = ref(1);
const score = ref(0);
const catSize = ref(1);
const isTabActive = ref(true);
const bowlPosition = reactive<Position>({ x: 50, y: 80 });

const foods = ref<FoodItem[]>([]);
let foodIdCounter = 0;

const targetScore = computed(() => {
  switch (level.value) {
    case 1:
      return 3;
    case 2:
      return 5;
    case 3:
      return 7;
    default:
      return 0;
  }
});

const progressPercentage = computed(() => {
  return (score.value / targetScore.value) * 100;
});
const isFinish = computed(() => {
  return level.value > 3;
});
const rightIndentCat = computed(() => {
  if (catSize.value == 1) return "2%";
  else if (catSize.value > 1.5) return `${7 * catSize.value}%`;
  else return `${5 * catSize.value}%`;
});

let foodTimer: ReturnType<typeof setInterval> | null = null;
let gameLoop: ReturnType<typeof setInterval> | null = null;

const startGame = () => {
  isPlaying.value = true;
  score.value = 0;
  level.value = 1;
  catSize.value = 1;
  foods.value = [];
  isLevelComplete.value = false;

  startFoodGeneration();
  startGameLoop();
};

const restartGame = () => {
  startGame();
};

const handleVisibilityChange = () => {
  isTabActive.value = !document.hidden;

  if (!isTabActive.value) {
    stopFoodGeneration();
  } else if (isPlaying.value && !isFeeding.value) {
    startFoodGeneration();
  }
};

const stopFoodGeneration = () => {
  if (foodTimer) {
    clearInterval(foodTimer);
    foodTimer = null;
  }
};

const moveBowl = (event: MouseEvent) => {
  if (!isPlaying.value) return;
  bowlPosition.x = getBowlPositionX(
    event.clientX,
    event.currentTarget as HTMLElement
  );
};

const moveBowlTouch = (event: TouchEvent) => {
  if (!isPlaying.value) return;
  event.preventDefault();
  const touch = event.touches[0];
  if (!touch) return;
  bowlPosition.x = getBowlPositionX(
    touch.clientX,
    event.currentTarget as HTMLElement
  );
};

const getBowlPositionX = (clientX: number, gameArea: HTMLElement) => {
  const rect = gameArea.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * 100;
  return Math.max(10, Math.min(90, x));
};

const startFoodGeneration = () => {
  if (foodTimer) clearInterval(foodTimer);

  foodTimer = setInterval(() => {
    if (!isPlaying.value || isFeeding.value) return;

    const newFood: FoodItem = {
      id: foodIdCounter++,
      x: Math.random() * 80 + 10,
      y: 0,
      type: [FoodType.FISH, FoodType.MEAT, FoodType.PIZZA, FoodType.CHEESE][
        Math.floor(Math.random() * 4)
      ] as FoodType,
      caught: false,
    };

    foods.value.push(newFood);
  }, 1200 - level.value * 100);
};

const startGameLoop = () => {
  if (gameLoop) clearInterval(gameLoop);

  gameLoop = setInterval(() => {
    if (!isPlaying.value || isFeeding.value) return;

    foods.value.forEach((food) => {
      if (!food.caught) {
        food.y += 2 + level.value * 0.2;

        if (food.y >= 75 && !food.caught) {
          const bowlLeft = bowlPosition.x - 5;
          const bowlRight = bowlPosition.x + 5;

          if (food.x >= bowlLeft && food.x <= bowlRight) {
            food.caught = true;
            score.value++;

            if (score.value >= targetScore.value) {
              isLevelComplete.value = true;
              if (foodTimer) clearInterval(foodTimer);
            }
          }
        }

        if (food.y > 100 && !food.caught) {
          const index = foods.value.indexOf(food);
          if (index > -1) {
            foods.value.splice(index, 1);
          }
        }
      }
    });

    foods.value = foods.value.filter((food) => !food.caught || food.y < 100);
  }, 16);
};

const feedCat = async () => {
  isFeeding.value = true;
  isLevelComplete.value = false;

  await new Promise((resolve) => setTimeout(resolve, 2000));

  catSize.value += 0.3;
  level.value++;
  score.value = 0;
  foods.value = [];
  isFeeding.value = false;

  if (level.value <= 3) {
    startFoodGeneration();
  }
};

onMounted(() => {
  document.addEventListener("visibilitychange", handleVisibilityChange);

  isTabActive.value = !document.hidden;
});
onUnmounted(() => {
  document.removeEventListener("visibilitychange", handleVisibilityChange);

  stopFoodGeneration();
  if (gameLoop) clearInterval(gameLoop);
});
</script>

<style scoped lang="scss">
.game {
  background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
  min-height: 100vh;
  width: 100%;
  &-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    color: white;
  }

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    h1 {
      font-size: 2.5em;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
  }

  &-stats {
    display: flex;
    align-items: center;
    gap: 30px;
    font-size: 1.2em;
    height: fit-content;
    .stat {
      background: rgba(255, 255, 255, 0.2);
      padding: 10px 20px;
      border-radius: 20px;
      backdrop-filter: blur(10px);
      height: fit-content;
    }
  }

  &-area {
    position: relative;
    width: 100%;
    height: 500px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    overflow: hidden;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.3);
    margin-bottom: 20px;

    .cat {
      position: absolute;
      transition: all 0.5s ease;
    }

    .bowl {
      position: absolute;
      bottom: 10px;
      transition: left 0.1s ease;
    }

    .food {
      position: absolute;
      transition: top 0.1s linear;
    }
  }

  &-controls {
    height: 72px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-bottom: 10px;
  }
  .progress-bar {
    width: 100%;
    height: 10px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 20px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, $primary-color, #000);
    transition: width 0.3s ease;
    border-radius: 5px;
  }
}

.start-screen,
.game-complete {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.start-screen,
.level-complete,
.feeding-animation,
.game-complete {
  animation: fadeIn 0.5s ease;
}

.feeding-animation {
  font-size: 1.5em;
  animation: bounce 0.5s infinite alternate;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}

@media (max-width: 768px) {
  .game-container {
    padding: 10px;
  }

  .game-area {
    height: 400px;
  }

  .game-header h1 {
    font-size: 2em;
  }

  .btn {
    padding: 12px 24px;
    font-size: 1.1em;
  }
}
</style>
