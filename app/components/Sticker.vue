<template>
  <div
    ref="stickerrRef"
    class="sticker"
    :class="{ 'sticker--expanded': isOpen }"
    @click="handleTriggerClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <CatIcon class="sticker__icon" />

    <transition>
      <div v-show="isOpen" class="sticker__content">
        <h3>Интересный факт!</h3>
        <p>
          Коты чаще всего левши, а кошки – правши.<br />Определить это можно,
          наблюдая, какой лапой питомец толкает мяч или пытается вытащить
          кусочки пищи из миски.
        </p>
        <button class="link link--color" @click="$emit('showConfirmModal')">
          Узнать больше
        </button>
      </div></transition
    >
  </div>
</template>

<script setup lang="ts">
import CatIcon from "~/assets/img/cat.svg";
const isOpen = ref(false);
const stickerrRef = ref<HTMLElement | null>(null);

const isMobile = ref(false);

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
.sticker {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #fff 0%, $secondary-color 100%);
  border-radius: 25px;
  padding: 15px;
  box-shadow: 0 8px 32px $shadow-secondary-color;
  transition: all 0.4s;
  z-index: 300;
  overflow: hidden;
  cursor: pointer;

  &--expanded {
    .sticker__icon {
      transform: scale(1.1) rotate(10deg);
    }
  }
  &__icon {
    transition: transform 0.4s ease;
    flex-shrink: 0;
    width: 80px;
    height: 80px;
  }

  &__content {
    transform: translateX(0);
    width: 250px;
    margin-left: 0;
    overflow: hidden;
    height: fit-content;
    margin-left: 15px;
    h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    p {
      font-size: 0.9rem;
      margin-bottom: 1rem;
      line-height: 1.4;
    }
  }
}

@media (max-width: 768px) {
  .sticker {
    right: 10px;
    padding: 12px;

    &--expanded {
      .sticker__content {
        width: 150px;
      }
    }
    &__icon {
      width: 50px;
      height: 50px;
    }
    &__content {
      width: 150px;
      h3 {
        font-size: 1rem;
      }

      p {
        font-size: 0.8rem;
      }
    }
  }
}
</style>
