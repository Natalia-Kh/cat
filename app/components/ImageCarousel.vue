<template>
  <Carousel v-bind="carouselConfig" class="image-carousel">
    <Slide v-for="(value, index) in imageUrls" :key="index" class="image-item">
      <Placeholder v-if="!isLoaded" class="image-loader" />
      <NuxtImg
        :src="value"
        @load="isLoaded = true"
        :class="{ 'image-hidden': !isLoaded }"
      />
    </Slide>
    <template #addons>
      <Pagination />
    </template>
  </Carousel>
</template>

<script setup lang="ts">
import "vue3-carousel/carousel.css";
import { Carousel, Slide, Pagination } from "vue3-carousel";

interface CarouselProps {
  imageUrls: string[];
}
const isLoaded = ref(false);
const { imageUrls } = defineProps<CarouselProps>();
const carouselConfig = {
  itemsToShow: 1,
};
</script>

<style scoped lang="scss">
.carousel {
  --vc-pgn-height: 10px;
  --vc-pgn-width: 10px;
  --vc-pgn-border-radius: 50%;
  --vc-png-bottom: -20px;
}
.image {
  &-carousel {
    height: 400px;
    margin-bottom: 20px;
  }
  &-item {
    position: relative;
    height: 100%;
    img {
      max-width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
      transition: opacity 0.3s ease;
    }
  }

  &-hidden {
    opacity: 0;
  }
  &-loader {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
