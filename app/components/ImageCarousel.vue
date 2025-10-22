<template>
  <Carousel v-bind="carouselConfig" class="image-carousel">
    <Slide
      v-for="(value, index) in props.imageUrls"
      :key="index"
      class="image-item"
    >
      <Placeholder v-if="!isImageLoaded(index)" class="image-loader" />
      <NuxtImg
        :src="value"
        :alt="`Изображение кота ${index + 1}`"
        placeholder
        :sizes="'400px'"
        format="webp"
        quality="80"
        @error="handleImageErrorEvent"
        :loading="index === 0 ? 'eager' : 'lazy'"
        @load="handleImageLoad(index)"
        :class="{ 'image-hidden': !isImageLoaded(index) }"
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

const props = defineProps<CarouselProps>();
const { handleImageError } = useImageErrorHandler();

const carouselConfig = {
  itemsToShow: 1,
  wrapAround: true,
  snapAlign: "center",
};

const loadedImages = ref(new Set<number>());

const handleImageLoad = (index: number) => {
  loadedImages.value.add(index);
};

const isImageLoaded = (index: number) => loadedImages.value.has(index);

const handleImageErrorEvent = (event: Event) => {
  const target = event.target as HTMLImageElement;
  handleImageError(new Error("Failed to load image"), target.src);
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
