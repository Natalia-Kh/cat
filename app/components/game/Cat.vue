<template>
  <div class="cat-silhouette" :style="{ transform: `scale(${size})` }">
    <CatSvg />
  </div>
</template>

<script setup lang="ts">
import CatSvg from "@/assets/img/game-cat.svg";
interface Props {
  size: number;
  isFeeding: boolean;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.cat-silhouette {
  position: relative;
  width: 180px;
  height: 135px;
  transform-origin: center;
}
</style>
