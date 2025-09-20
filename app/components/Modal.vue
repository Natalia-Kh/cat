<template>
  <transition name="fade">
    <div v-if="isVisible" class="modal-overlay" @click.self="close">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ title }}</h2>
          <button class="modal-close" @click="close">&times;</button>
        </div>

        <div class="modal-content">
          <p>{{ text }}</p>
        </div>

        <div class="modal-footer" v-if="showButtons">
          <button class="link link--color" @click="confirm">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div></transition
  >
</template>

<script setup lang="ts">
interface Props {
  isVisible: boolean;
  title?: string;
  text: string;
  showButtons?: boolean;
  confirmText?: string;
  cancelText?: string;
}

interface Emits {
  (e: "update:isVisible", value: boolean): void;
  (e: "confirm"): void;
  (e: "close"): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Уведомление",
  showButtons: false,
  confirmText: "OK",
  cancelText: "Отмена",
});

const emit = defineEmits<Emits>();

const close = () => {
  emit("update:isVisible", false);
  emit("close");
};

const confirm = () => {
  emit("confirm");
  close();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && props.isVisible) {
    close();
  }
};

watch(
  () => props.isVisible,
  (val) => {
    if (!import.meta.client) return;
    if (val) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  },
  { immediate: true }
);

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
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
    height: fit-content;
    overflow-y: auto;
  }

  &-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px;
    border-top: 1px solid $secondary-color;
    background-color: #f9fafb;
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
