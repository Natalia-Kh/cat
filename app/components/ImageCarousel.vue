<template>
  <Carousel v-bind="carouselConfig" class="image-carousel">
    <Slide v-if="loading">
      <div class="loading">Загрузка...</div>
    </Slide>
    <Slide v-for="(value, index) in imageUrls" :key="index" class="image-item">
      <img :src="value" :alt="`Image ${index + 1}`" loading="lazy" />
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
  loading: boolean;
}
const { imageUrls, loading } = defineProps<CarouselProps>();
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
.image-carousel {
  height: 400px;
  margin-bottom: 20px;
}
.image-item {
  position: relative;
  height: 100%;
}

.image-item img {
  max-width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
