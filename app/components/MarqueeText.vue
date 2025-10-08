<template>
  <div class="marquee" ref="marqueeContainer">
    <div class="marquee-track" ref="marqueeTrack">
      <div
        v-for="(item, index) in duplicatedItems"
        :key="`${index}-${item.id}`"
        class="marquee-item"
      >
        <span
          class="marquee-word"
          :style="getWordStyle(index)"
          :data-color-index="getColorIndex(index)"
        >
          {{ item.text }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { gsap } from "gsap";
import { DirectionType } from "@/types/index";
interface MarqueeItem {
  id: number;
  text: string;
}

interface Props {
  items?: string[];
  speed?: number;
  direction?: DirectionType;
  pauseOnHover?: boolean;
  rainbowColors?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  speed: 1,
  direction: DirectionType.LEFT,
  pauseOnHover: true,
  rainbowColors: () => [
    "#ff0000",
    "#ff7f00",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#0000ff",
    "#8b00ff",
  ],
});

const marqueeContainer = ref<HTMLElement>();
const marqueeTrack = ref<HTMLElement>();
let animation: gsap.core.Tween | null = null;

const marqueeItems = computed<MarqueeItem[]>(() =>
  props.items.map((text, index) => ({
    id: index,
    text,
  }))
);

const duplicatedItems = computed<MarqueeItem[]>(() => [
  ...marqueeItems.value,
  ...marqueeItems.value.map((item) => ({
    ...item,
    id: item.id + props.items.length,
  })),
  ...marqueeItems.value.map((item) => ({
    ...item,
    id: item.id + props.items.length * 2,
  })),
]);

const getColorIndex = (index: number): number => {
  return index % props.rainbowColors.length;
};

const getWordStyle = (index: number) => {
  const colorIndex = getColorIndex(index);
  const currentColor = props.rainbowColors[colorIndex];
  const nextColorIndex = (colorIndex + 1) % props.rainbowColors.length;
  const nextColor = props.rainbowColors[nextColorIndex];

  return {
    background: `linear-gradient(90deg, ${currentColor} 0%, ${nextColor} 80%)`,
  };
};

const getOriginalTrackWidth = (): number => {
  if (!marqueeTrack.value) return 0;

  const track = marqueeTrack.value;
  const items = track.querySelectorAll(".marquee-item");
  const originalItemCount = props.items.length;

  let totalWidth = 0;
  for (let i = 0; i < originalItemCount; i++) {
    const item = items[i] as HTMLElement;
    if (item) {
      totalWidth += item.offsetWidth;
    }
  }

  return totalWidth;
};

const initAnimation = () => {
  if (!marqueeTrack.value || !marqueeContainer.value) return;

  const direction = props.direction === DirectionType.LEFT ? -1 : 0;

  const originalTrackWidth = getOriginalTrackWidth();
  const startX =
    props.direction === DirectionType.LEFT ? 0 : -originalTrackWidth;
  gsap.set(marqueeTrack.value, { x: startX });
  const track = marqueeTrack.value;
  animation = gsap.to(marqueeTrack.value, {
    x: direction * originalTrackWidth,
    duration: originalTrackWidth / (50 * props.speed),
    ease: "none",
    repeat: -1,
    onRepeat: () => {
      gsap.set(track, { x: startX });
      requestAnimationFrame(() => {
        gsap.set(track, { x: startX });
      });
    },
  });

  if (props.pauseOnHover) {
    marqueeContainer.value.addEventListener("mouseenter", pauseAnimation);
    marqueeContainer.value.addEventListener("mouseleave", resumeAnimation);
  }
};

const pauseAnimation = () => {
  if (animation) animation.pause();
};

const resumeAnimation = () => {
  if (animation) animation.play();
};

const destroyAnimation = () => {
  if (animation) {
    animation.kill();
    animation = null;
  }

  if (marqueeContainer.value && props.pauseOnHover) {
    marqueeContainer.value.removeEventListener("mouseenter", pauseAnimation);
    marqueeContainer.value.removeEventListener("mouseleave", resumeAnimation);
  }
};

const restartAnimation = () => {
  destroyAnimation();
  nextTick(() => {
    initAnimation();
  });
};
const setupHoverHandlers = () => {
  if (!marqueeContainer.value) return;

  marqueeContainer.value.removeEventListener("mouseenter", pauseAnimation);
  marqueeContainer.value.removeEventListener("mouseleave", resumeAnimation);

  if (props.pauseOnHover) {
    marqueeContainer.value.addEventListener("mouseenter", pauseAnimation);
    marqueeContainer.value.addEventListener("mouseleave", resumeAnimation);
  }
};

watch(
  () => props.speed,
  () => {
    restartAnimation();
  }
);

watch(
  () => props.direction,
  () => {
    restartAnimation();
  }
);

watch(
  () => props.pauseOnHover,
  (newValue) => {
    setupHoverHandlers();
    if (!newValue && animation) {
      animation.play();
    }
  }
);

onMounted(() => {
  nextTick(() => {
    initAnimation();
  });
});

onUnmounted(() => {
  destroyAnimation();
});
</script>

<style scoped lang="scss">
.marquee {
  overflow: hidden;
  position: relative;
  width: 100%;
  padding: 1.5rem 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    width: 100px;
    height: 100%;
    z-index: 2;
    pointer-events: none;
  }

  &::before {
    left: 0;
    background: linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, transparent 100%);
  }

  &::after {
    right: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
  }

  &-track {
    display: flex;
    align-items: center;
    width: max-content;
    gap: 0;
  }

  &-item {
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
  }

  &-word {
    font-size: 2rem;
    font-weight: 800;
    background-size: 200% 200%;
    transition: all 0.3s ease;
    white-space: nowrap;
    position: relative;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    -webkit-text-fill-color: transparent;
    color: transparent;
    &:hover {
      transform: translateY(-2px);
      filter: brightness(1.2);
      &::after {
        opacity: 0.1;
        animation: gradientShift 2s ease infinite;
      }
    }
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: inherit;
      background-size: 200% 200%;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: -1;
      border-radius: 4px;
      padding: 0.2rem 0.5rem;
      margin: -0.2rem -0.5rem;
    }
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 90% 50%;
  }
  100% {
    background-position: 0% 90%;
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .marquee {
    &-word {
      font-size: 1.5rem;
    }

    &-item {
      padding: 0 1rem;
    }

    &-container::before,
    &-container::after {
      width: 50px;
    }
  }
}

@media (max-width: 480px) {
  .marquee-word {
    font-size: 1.2rem;
  }

  .marquee-item {
    padding: 0 0.8rem;
  }
}
</style>
