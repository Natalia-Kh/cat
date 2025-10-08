<template>
  <div class="home">
    <NuxtLink to="/sticker" class="btn">
      Посмотреть страницу со стикером
    </NuxtLink>
    <NuxtLink to="/game" class="btn"> Игра </NuxtLink>
    <NuxtLink to="/animation" class="btn"> Анимация </NuxtLink>
  </div>
</template>

<style scoped lang="scss">
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  padding: $padding-base;
}
</style>
