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

      <div
        class="game-area"
        role="application"
        aria-label="Игровая область для кормления кота"
        tabindex="0"
        @mousemove="moveBowl"
        @touchmove="moveBowlTouch"
        @keydown="handleKeyboard"
      >
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
import { storeToRefs } from "pinia";
import { useGameStore } from "~/stores/game";
import { useGameLoop, useFoodGenerator } from "~/composables/useGameLoop";
import { useErrorHandler } from "~/composables/useErrorHandler";

definePageMeta({
  layout: false,
});

const gameStore = useGameStore();
const {
  start: startGameLoop,
  stop: stopGameLoop,
  pause: pauseGameLoop,
  resume: resumeGameLoop,
} = useGameLoop();
const { startGeneration, stopGeneration, restartGeneration } =
  useFoodGenerator();
const { addError } = useErrorHandler();

// Computed properties из store
const {
  score,
  level,
  isPlaying,
  isFeeding,
  isLevelComplete,
  targetScore,
  catSize,
  foods,
  bowlPosition,
  progressPercentage,
  isGameFinished: isFinish,
  rightIndentCat,
} = storeToRefs(gameStore);

const startGame = () => {
  try {
    gameStore.startGame();
    startGameLoop();
    startGeneration();
  } catch (error) {
    addError(error, "Failed to start game");
  }
};

const restartGame = () => {
  startGame();
};

const handleVisibilityChange = () => {
  const isTabActive = !document.hidden;
  gameStore.setTabActive(isTabActive);

  if (!isTabActive) {
    pauseGameLoop();
    stopGeneration();
  } else if (isPlaying.value && !isFeeding.value) {
    resumeGameLoop();
    restartGeneration();
  }
};

const moveBowl = (event: MouseEvent) => {
  if (!isPlaying.value) return;
  const x = getBowlPositionX(event.clientX, event.currentTarget as HTMLElement);
  gameStore.moveBowl({ x, y: bowlPosition.value.y });
};

const moveBowlTouch = (event: TouchEvent) => {
  if (!isPlaying.value) return;
  event.preventDefault();
  const touch = event.touches[0];
  if (!touch) return;
  const x = getBowlPositionX(touch.clientX, event.currentTarget as HTMLElement);
  gameStore.moveBowl({ x, y: bowlPosition.value.y });
};

const getBowlPositionX = (clientX: number, gameArea: HTMLElement) => {
  const rect = gameArea.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * 100;
  return Math.max(10, Math.min(90, x));
};

const handleKeyboard = (event: KeyboardEvent) => {
  if (!isPlaying.value) return;

  const step = 5; // Шаг движения миски

  switch (event.key) {
    case "ArrowLeft":
    case "a":
    case "A":
      event.preventDefault();
      gameStore.moveBowl({
        x: Math.max(10, bowlPosition.value.x - step),
        y: bowlPosition.value.y,
      });
      break;
    case "ArrowRight":
    case "d":
    case "D":
      event.preventDefault();
      gameStore.moveBowl({
        x: Math.min(90, bowlPosition.value.x + step),
        y: bowlPosition.value.y,
      });
      break;
    case " ":
    case "Enter":
      event.preventDefault();
      if (isLevelComplete.value) {
        feedCat();
      }
      break;
  }
};

const feedCat = async () => {
  try {
    pauseGameLoop();
    stopGeneration();
    await gameStore.feedCat();

    if (level.value <= 3) {
      resumeGameLoop();
      restartGeneration();
    }
  } catch (error) {
    addError(error, "Failed to feed cat");
  }
};

onMounted(() => {
  document.addEventListener("visibilitychange", handleVisibilityChange);
  gameStore.setTabActive(!document.hidden);
});

onUnmounted(() => {
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  stopGameLoop();
  stopGeneration();
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
  .game {
    &-container {
      padding: 10px;
    }

    &-area {
      height: 60vh;
      min-height: 300px;
      touch-action: pan-x; // Разрешить только горизонтальную прокрутку

      &:active {
        cursor: grabbing;
      }
    }

    &-header {
      flex-direction: column;
      gap: 1rem;

      h1 {
        font-size: 2em;
        text-align: center;
      }

      &-stats {
        flex-direction: column;
        gap: 10px;
        align-items: center;
      }
    }

    &-controls {
      flex-direction: column;
      gap: 1rem;
      height: auto;
      min-height: 72px;
    }
  }

  .btn {
    padding: 12px 24px;
    font-size: 1.1em;
    min-height: 44px; // Минимальный размер для touch
    touch-action: manipulation; // Отключить двойной тап
  }

  .progress-bar {
    margin-bottom: 15px;
  }
}

@media (max-width: 480px) {
  .game {
    &-area {
      height: 50vh;
      min-height: 250px;
    }

    &-header h1 {
      font-size: 1.5em;
    }

    &-stats .stat {
      padding: 8px 16px;
      font-size: 1em;
    }
  }

  .btn {
    padding: 10px 20px;
    font-size: 1em;
  }
}
</style>
