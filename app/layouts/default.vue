<template>
  <div class="auth-layout">
    <header class="header">
      <div v-if="user" class="header-user">
        <span>Привет, {{ user }}!</span>
        <button @click="logout" class="btn btn--full">Выйти</button>
      </div>
      <button v-else @click="showAuthModal" class="btn">Войти</button>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { COMPONENT_NAMES } from "@/types/index";

const modalStore = useModalStore();
const { user, logout, login, initUser } = useAuth();

const showAuthModal = () => {
  modalStore.showModal(
    undefined,
    "Авторизация",
    false,
    COMPONENT_NAMES.MODAL_AUTH,
    login
  );
};

onMounted(() => {
  initUser();
});
</script>

<style scoped lang="scss">
.auth-layout {
  min-height: 100vh;
}

.header {
  background: #f8f9fa;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  justify-content: end;
  &-user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
}
</style>
