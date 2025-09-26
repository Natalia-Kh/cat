<template>
  <div
    v-if="!pending"
    ref="stickerrRef"
    class="sticker"
    :class="{ 'sticker--expanded ': isOpen }"
    @click="handleTriggerClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <h3 v-show="isOpen">Консультация эксперта</h3>
    <div class="image-grid-stack">
      <img
        v-for="(image, index) in data.images"
        :key="index"
        :src="image"
        :alt="`Image ${index + 1}`"
        loading="lazy"
      />
    </div>
    <transition name="fade">
      <button
        v-show="isOpen"
        class="link link--white"
        @click="$emit('showConfirmModal')"
      >
        Получить консультацию
      </button></transition
    >
    <svg
      v-show="!isOpen"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20 12H4M4 12L10 18M4 12L10 6"
        stroke="#285599"
        stroke-width="2"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
const { fetchRandomImages } = useImages();
const isOpen = ref(false);
const stickerrRef = ref<HTMLElement | null>(null);
const isMobile = ref(false);

const { data, pending } = fetchRandomImages(3);

onMounted(() => {
  checkDeviceType();
  window.addEventListener("resize", checkDeviceType);
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkDeviceType);
  document.removeEventListener("click", handleClickOutside);
});

const checkDeviceType = () => {
  isMobile.value = window.innerWidth < 768;
};

const handleMouseEnter = () => {
  isOpen.value = true;
};

const handleMouseLeave = () => {
  isOpen.value = false;
};

const handleTriggerClick = () => {
  isOpen.value = true;
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    isOpen.value &&
    stickerrRef.value &&
    !stickerrRef.value.contains(event.target as Node)
  ) {
    close();
  }
};

const close = () => {
  isOpen.value = false;
};
</script>

<style scoped lang="scss">
$img-size: 80px;
$img-bias: 24px;

.v-enter-active {
  transition: opacity 0.5s ease-out;
}

.v-leave-active {
  transition: opacity 0.3s ease-in;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
  width: 0;
  transform: translateX(40px);
}
.v-enter-to {
  opacity: 1;
}
.fade-leave-active {
  transition-duration: 0ms;
  transition-timing-function: ease-out;
}
.fade-enter-active {
  transition-delay: 1s;
  transition: opacity 0.3s ease-in;
}

.fade-enter-from {
  opacity: 0;
  pointer-events: none;
}

.fade-leave-to {
  opacity: 0;
  pointer-events: none;
}

.sticker {
  position: fixed;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  height: 260px;
  background: $secondary-color;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  padding: 15px;
  box-shadow: 0 8px 32px $shadow-secondary-color;
  transition: all 0.4s;
  z-index: 300;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.8s;
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    visibility: hidden;
    width: 0;
    height: 0;
    opacity: 0;
    text-align: center;
    max-width: 160px;
    transition: opacity 0s ease-in 0s, opacity 0.4s ease-out 0s;
  }

  svg {
    transition: all 0.6s;
  }
  &--expanded {
    max-width: 250px;

    h3 {
      visibility: visible;
      width: fit-content;
      height: fit-content;
      opacity: 1;
    }
    .image-grid-stack {
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: 1fr;
      overflow: hidden;
      width: calc($img-size * 3 - (2 * $img-bias));
      height: fit-content;
      img {
        @for $i from 1 through 3 {
          &:nth-child(#{$i}) {
            grid-row: 1;
            grid-column: #{$i};
            transform: translateY(0) translateX(#{-$img-bias * ($i - 1)});
          }
        }
      }
    }
  }
}
.image-grid-stack {
  display: grid;
  width: fit-content;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(3, 1fr);
  align-items: center;
  justify-items: center;
  margin: 0 auto;
  height: calc($img-size * 3 - (2 * $img-bias));
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  img {
    width: $img-size;
    height: $img-size;
    border: 4px solid $secondary-color;
    border-radius: 16px;
    transition: all 0.3s ease;
    object-fit: cover;
    grid-row: 1;
    transition: all 0.6s ease;
    &:hover {
      transform: scale(1.1) translateY(-5px);
      z-index: 10;
    }
    @for $i from 1 through 3 {
      &:nth-child(#{$i}) {
        grid-row: #{$i};
        z-index: #{$i};
        transform: translateY(#{-$img-bias * ($i - 1)});
      }
    }
  }
}

@media (max-width: 768px) {
  .sticker {
    padding: 12px;

    &--expanded {
    }

    h3 {
      font-size: 1rem;
    }
  }
}
</style>
