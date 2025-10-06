<template>
  <transition name="fade">
    <div v-if="isModalVisible" class="modal-overlay" @click.self="close">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ title }}</h2>
          <button class="modal-close" @click="close">&times;</button>
        </div>

        <div
          class="modal-content"
          :class="{ 'modal-content-short': showModalButtons }"
        >
          <p v-if="text">{{ text }}</p>
          <component
            v-if="componentName"
            :is="resolvedComponent"
            :componentFn="componentFn"
          />
        </div>

        <div class="modal-footer" v-if="showModalButtons">
          <button class="btn btn--white" @click="confirm">Ok</button>
        </div>
      </div>
    </div></transition
  >
</template>

<script setup lang="ts">
import { useModal } from "@/composables/useModal";
import { useLazyComponent } from "@/composables/useLazyComponent";
interface Emits {
  (e: "confirm"): void;
  (e: "close"): void;
}

const emit = defineEmits<Emits>();

const close = () => {
  hideModal();
};

const confirm = () => {
  close();
};

const {
  isModalVisible,
  componentName,
  showModalButtons,
  componentFn,
  title,
  text,
  hideModal,
} = useModal();

const { resolvedComponent, loadComponent, resetComponent } = useLazyComponent();

watch(
  () => componentName?.value,
  async (newName) => {
    if (!newName) {
      resetComponent();
      return;
    }
    await loadComponent(newName);
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
.modal {
  &-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  &-container {
    background: white;
    border-radius: 12px;
    padding: 0;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    height: 100%;
    max-height: 364px;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid $primary-color;
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
    }
  }

  &-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6b7280;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f3f4f6;
      color: #374151;
    }
  }

  &-content {
    padding: 20px;
    height: calc(100% - 73px);
    overflow-y: auto;
    &-short {
      height: calc(100% - 156px);
    }
  }

  &-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px;
    border-top: 1px solid $secondary-color;
    background-color: #eeeff0;
  }

  &-button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
    &-cancel {
      background-color: #f3f4f6;
      color: #374151;
      &:hover {
        background-color: #e5e7eb;
      }
    }
  }
}

@media (max-width: 640px) {
  .modal {
    &-container {
      width: 95%;
      margin: 10px;
    }

    &-footer {
      flex-direction: column;
    }

    &-button {
      width: 100%;
    }
  }
}
</style>
