import { ref, onMounted, onUnmounted, watch } from "vue";
import { useGameStore } from "~/stores/game";
import { type FoodItem, FoodType } from "~/types/game";

export const useGameLoop = () => {
  const gameStore = useGameStore();
  let animationId: number | null = null;
  let lastTime = 0;
  const isRunning = ref(false);

  const updateFoodPositions = () => {
    const levelConfig = gameStore.currentLevelConfig;
    if (!levelConfig) return;
    gameStore.foods.forEach((food) => {
      if (!food.caught && gameStore.isPlaying && !gameStore.isFeeding) {
        // Обновляем позицию еды
        const newY = food.y + levelConfig.foodSpeed;

        gameStore.updateFoodPosition(food.id, {
          x: food.x,
          y: newY,
        });

        // Проверяем столкновение с миской
        if (newY >= 80) {
          const bowlLeft = gameStore.bowlPosition.x - 5;
          const bowlRight = gameStore.bowlPosition.x + 5;

          if (food.x >= bowlLeft && food.x <= bowlRight) {
            gameStore.catchFood(food.id);
          }
        }

        // Удаляем еду, которая упала за пределы экрана
        if (newY > 100) {
          gameStore.removeFood(food.id);
        }
      }
    });
  };

  const gameLoop = (currentTime: number) => {
    if (!isRunning.value) return;

    const deltaTime = currentTime - lastTime;

    // Обновляем логику игры с частотой ~60 FPS
    if (deltaTime >= 16) {
      updateFoodPositions();
      lastTime = currentTime;
    }

    animationId = requestAnimationFrame(gameLoop);
  };

  const start = () => {
    if (!isRunning.value) {
      isRunning.value = true;
      lastTime = performance.now();
      animationId = requestAnimationFrame(gameLoop);
    }
  };

  const stop = () => {
    isRunning.value = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  const pause = () => {
    stop();
  };

  const resume = () => {
    if (gameStore.isPlaying && !gameStore.isFeeding) {
      start();
    }
  };

  // Автоматически останавливаем при размонтировании
  onUnmounted(() => {
    stop();
  });

  return {
    start,
    stop,
    pause,
    resume,
    isRunning: readonly(isRunning),
  };
};

export const useFoodGenerator = () => {
  const gameStore = useGameStore();
  let foodTimer: ReturnType<typeof setInterval> | null = null;

  const generateFood = () => {
    if (
      !gameStore.isPlaying ||
      gameStore.isFeeding ||
      gameStore.isLevelComplete
    )
      return;

    const levelConfig = gameStore.currentLevelConfig;
    const foodTypes: FoodType[] = [
      FoodType.FISH,
      FoodType.MEAT,
      FoodType.PIZZA,
      FoodType.CHEESE,
    ];

    const newFood: Omit<FoodItem, "id"> = {
      x: Math.random() * 80 + 10,
      y: 0,
      type:
        foodTypes[Math.floor(Math.random() * foodTypes.length)] ??
        FoodType.FISH,
      caught: false,
      speed: levelConfig?.foodSpeed ?? 2,
      rotation: Math.random() * 360,
    };

    gameStore.addFood(newFood);
  };

  const startGeneration = () => {
    if (foodTimer) clearInterval(foodTimer);

    const levelConfig = gameStore.currentLevelConfig;
    if (levelConfig)
      foodTimer = setInterval(generateFood, levelConfig.spawnRate);
  };

  const stopGeneration = () => {
    if (foodTimer) {
      clearInterval(foodTimer);
      foodTimer = null;
    }
  };

  const restartGeneration = () => {
    stopGeneration();
    if (gameStore.isPlaying && !gameStore.isFeeding) {
      startGeneration();
    }
  };

  watch(
    () => gameStore.isLevelComplete,
    (isComplete: boolean) => {
      if (isComplete) {
        stopGeneration();
      }
    }
  );
  // Очистка при размонтировании
  onUnmounted(() => {
    stopGeneration();
  });

  return {
    startGeneration,
    stopGeneration,
    restartGeneration,
  };
};
