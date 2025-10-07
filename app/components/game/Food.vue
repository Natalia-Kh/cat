<template>
  <div
    class="food"
    :class="[type, { caught }]"
    :style="{
      left: position.x + '%',
      top: position.y + '%',
    }"
  >
    <div class="food-icon">
      <component :is="foodEmoji" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Position, FoodType } from "~/types/game";
import { computed } from "vue";
import Meat from "@/assets/img/mcol_sausage.svg";
import Fish from "@/assets/img/fish.svg";
import Pizza from "@/assets/img/pizza.svg";
import Cheese from "@/assets/img/cheese.svg";

interface Props {
  position: Position;
  type: FoodType;
  caught: boolean;
}

const props = defineProps<Props>();

const foodEmoji = computed(() => {
  switch (props.type) {
    case FoodType.FISH:
      return Fish;
    case FoodType.MEAT:
      return Meat;
    case FoodType.PIZZA:
      return Pizza;
    default:
      return Cheese;
  }
});
</script>

<style scoped lang="scss">
.food {
  position: absolute;
  width: 60px;
  height: 60px;
  transition: all 0.1s linear;
  animation: float 2s ease-in-out infinite;
  z-index: 10;
  &-icon {
    animation: rotate 3s linear infinite;
  }
  &.caught {
    animation: catch 0.5s ease-out forwards;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(5deg);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes catch {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0) translateY(20px);
    opacity: 0;
  }
}
</style>
