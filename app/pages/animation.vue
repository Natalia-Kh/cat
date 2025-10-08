<template>
  <div class="animation">
    <h1 class="animation-title">Анимация (GSAP)</h1>

    <div class="animation-marquee-section">
      <MarqueeText
        :items="marqueeItems"
        :speed="1.2"
        :direction="DirectionType.LEFT"
        :pause-on-hover="true"
        :gradient="true"
      />
    </div>

    <div class="animation-controls">
      <h2>Настройки анимации</h2>
      <div class="animation-controls-group">
        <label>
          Скорость:
          <input v-model="speed" type="range" min="0.4" max="4" step="0.2" />
          {{ speed }}
        </label>

        <label>
          Направление:
          <select v-model="direction" name="direction">
            <option :value="DirectionType.LEFT">Слева направо</option>
            <option :value="DirectionType.RIGHT">Справа налево</option>
          </select>
        </label>

        <label>
          Пауза при наведении
          <input v-model="pauseOnHover" type="checkbox" />
        </label>
      </div>
    </div>

    <div class="animation-marquee-section secondary">
      <MarqueeText
        :items="secondaryItems"
        :speed="speed"
        :direction="direction"
        :pause-on-hover="pauseOnHover"
        :show-dividers="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { DirectionType } from "@/types/index";
definePageMeta({
  layout: false,
});

const marqueeItems = ref([
  "красный",
  "оранжевый",
  "желтый",
  "зеленый",
  "голубой",
  "синий",
  "фиолетовый",
]);

const secondaryItems = ref([
  "красный",
  "оранжевый",
  "желтый",
  "зеленый",
  "голубой",
  "синий",
  "фиолетовый",
]);

const speed = ref(1.2);
const direction = ref<DirectionType>(DirectionType.LEFT);
const pauseOnHover = ref(true);
</script>

<style scoped lang="scss">
.animation {
  min-height: 100vh;
  background: linear-gradient(135deg, #000 0%, #fff 100%);
  color: white;
  padding: $padding-base 0;

  &-title {
    font-size: 3rem;
    font-weight: 800;
    padding: 0 $padding-base;
    margin-bottom: 1rem;
  }

  &-marquee-section {
    margin: 3rem 0;
    overflow: hidden;
    &.secondary {
      margin-top: 2rem;
    }
  }

  &-controls {
    background: rgba(255, 255, 255, 0.35);
    padding: $padding-base;
    border-radius: 12px;
    margin: $padding-base;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    h2 {
      margin-bottom: 1.5rem;
      color: #fff;
    }

    &-group {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      align-items: flex-start;
      label {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.9rem;
      }
      input[type="range"] {
        width: 150px;
      }

      select,
      input[type="range"] {
        padding: 0.5rem;
        border-radius: 6px;

        background: rgba(255, 255, 255, 0.1);
        color: white;
      }
      select option {
        background: rgba(0, 0, 0, 0.5);
      }
      select:focus-visible {
        outline: none;
      }
      input[type="checkbox"] {
        margin-right: 0.5rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .animation {
    padding: 1rem;
    &-title {
      font-size: 2rem;
    }

    &-controls-group {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }
}
</style>
