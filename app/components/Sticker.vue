<template>
  <div
    v-if="!loading"
    ref="stickerrRef"
    class="sticker"
    :class="{ 'sticker--expanded ': isOpen }"
    @click="openSticker()"
    @mouseenter="openSticker()"
    @mouseleave="closeSticker()"
  >
    <h3 v-show="isOpen">Консультация эксперта</h3>
    <div class="sticker-image-grid">
      <img
        v-for="(image, index) in images"
        :key="index"
        :src="image"
        :alt="`Image ${index + 1}`"
        loading="lazy"
      />
    </div>
    <transition name="fade-link">
      <button
        v-show="isOpen"
        class="btn btn--white"
        @click="$emit('showConfirmModal')"
      >
        Получить консультацию
      </button>
    </transition>
    <svg
      v-show="!isOpen"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20 12H4M4 12L10 18M4 12L10 6"
        stroke="#a7a8aa"
        stroke-width="2"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false);
const stickerrRef = ref<HTMLElement | null>(null);

const { images, loading } = useImages(3, {
  immediate: true,
});

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const handleClickOutside = (event: MouseEvent) => {
  if (
    isOpen.value &&
    stickerrRef.value &&
    !stickerrRef.value.contains(event.target as Node)
  ) {
    closeSticker();
  }
};

const openSticker = () => {
  isOpen.value = true;
};

const closeSticker = () => {
  isOpen.value = false;
};
</script>

<style scoped lang="scss">
$img-count: 3;
$img-size: 60px;
$img-bias: 18px;

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
.fade-link-leave-active {
  transition: opacity 0s;
}
.fade-link-enter-active {
  pointer-events: none !important;
  transition: opacity 0.4s ease-in 0.1s;
}

.fade-link-enter-from,
.fade-link-leave-to {
  opacity: 0 !important;
}
.fade-link-enter-to {
  opacity: 1;
}

@keyframes titleShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
  padding: 26px 4px;
  box-shadow: 8px $shadow-secondary-color;
  transition: all 0.4s;
  z-index: 300;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.8s;
  h3 {
    font-size: 1.2rem;
    font-weight: 700;
    opacity: 0;
    text-align: center;
    max-width: 160px;
    animation: titleShow 0.4s 0s ease-in both;
  }

  svg {
    transition: all 0.6s;
  }

  &--expanded {
    max-width: 280px;
    padding: 26px;

    .sticker-image-grid {
      grid-template-columns: repeat($img-count, 1fr);
      grid-template-rows: 1fr;
      overflow: hidden;
      width: calc($img-size * $img-count - (2 * $img-bias));
      height: fit-content;
      img {
        @for $i from 1 through $img-count {
          &:nth-child(#{$i}) {
            grid-row: 1;
            grid-column: #{$i};
            transform: translateY(0) translateX(#{-$img-bias * ($i - 1)});
          }
        }
      }
    }
  }
  &-image-grid {
    display: grid;
    width: fit-content;
    grid-template-columns: 1fr;
    grid-template-rows: repeat($img-count, 1fr);
    align-items: center;
    justify-items: center;
    margin: 0 auto;
    height: calc($img-size * $img-count - (2 * $img-bias));
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
      @for $i from 1 through $img-count {
        &:nth-child(#{$i}) {
          grid-row: #{$i};
          z-index: #{$i};
          transform: translateY(#{-$img-bias * ($i - 1)});
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .sticker {
    h3 {
      font-size: 1rem;
    }
  }
}
</style>
