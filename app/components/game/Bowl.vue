<template>
  <div
    class="bowl"
    :style="{
      left: position.x + '%',
      transform: ` translateX(-50%) scale(${1 + (score / targetScore) * 0.2})`,
    }"
  >
    <BowlSvg />
    <div class="bowl-content">
      <span class="bowl-score">{{ score }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Position } from "~/types/game";
import BowlSvg from "@/assets/img/bowl.svg";

interface Props {
  position: Position;
  score: number;
  targetScore: number;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.bowl {
  position: absolute;
  width: 100px;
  height: 40px;
  transition: all 0.3s ease;
  &-content {
    position: absolute;
    top: 90%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: bold;
    font-size: 1em;
    color: black;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
}
</style>
