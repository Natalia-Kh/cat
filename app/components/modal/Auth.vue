<template>
  <form @submit.prevent="authLogin" class="login-form">
    <div class="input-group">
      <label for="username">Имя пользователя:</label>
      <input
        id="username"
        v-model="username"
        type="text"
        placeholder="Введите ваше имя"
        required
        maxlength="20"
      />
    </div>
    <button type="submit" class="btn btn--full">Войти</button>
  </form>
</template>

<script setup lang="ts">
interface Props {
  componentFn?: (s: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  componentFn: (s: string) => {
    return;
  },
});

const username = ref("");
import { useModalStore } from "~/stores/modal";
const modalStore = useModalStore();
const authLogin = () => {
  const name = username.value.trim();
  if (name) {
    props.componentFn(name);
    username.value = "";
    modalStore.hideModal();
  }
};
</script>

<style scoped lang="scss">
.login-form {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;

  .input-group {
    margin-bottom: 1.5rem;
    width: 100%;
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 5px;
      font-size: 1rem;
      transition: border-color 0.3s;
      &:focus {
        outline: none;
        border-color: $primary-color;
      }
    }
  }
}
</style>
