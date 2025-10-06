<template>
  <div :class="['loader', size]">
    <svg
      :width="svgSize"
      :height="svgSize"
      viewBox="0 0 50 50"
      class="loader-svg"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke-width="4"
        stroke-linecap="round"
        class="loader-circle"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: "small" | "medium" | "large";
}

const props = withDefaults(defineProps<Props>(), {
  size: "medium",
});

const svgSize = computed(() => {
  const sizes = {
    small: 30,
    medium: 50,
    large: 70,
  };
  return sizes[props.size];
});
</script>

<style scoped lang="scss">
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  &.small {
    padding: 1rem;
  }
  &.medium {
    padding: 2rem;
  }

  &.large {
    padding: 3rem;
  }

  &-svg {
    animation: rotate 2s linear infinite;
  }

  &-circle {
    animation: dash 1.5s ease-in-out infinite;
    stroke: $primary-color;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
