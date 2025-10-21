<template>
  <Transition name="error-slide">
    <div v-if="isErrorVisible && errors.length > 0" class="error-container">
      <div 
        v-for="error in errors" 
        :key="error.timestamp"
        class="error-item"
        role="alert"
        aria-live="polite"
      >
        <div class="error-content">
          <div class="error-icon">⚠️</div>
          <div class="error-text">
            <div class="error-message">{{ error.message }}</div>
            <div v-if="error.context" class="error-context">{{ error.context }}</div>
          </div>
          <button 
            class="error-close"
            @click="removeError(error.timestamp)"
            aria-label="Закрыть ошибку"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useErrorHandler } from "~/composables/useErrorHandler";

const { errors, isErrorVisible, removeError } = useErrorHandler();
</script>

<style scoped lang="scss">
.error-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.error-item {
  background: #ff4444;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.error-content {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  gap: 12px;
}

.error-icon {
  font-size: 1.2em;
  flex-shrink: 0;
  margin-top: 2px;
}

.error-text {
  flex: 1;
  min-width: 0;
}

.error-message {
  font-weight: 600;
  margin-bottom: 4px;
  word-wrap: break-word;
}

.error-context {
  font-size: 0.9em;
  opacity: 0.9;
  word-wrap: break-word;
}

.error-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5em;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
  }
}

.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.3s ease;
}

.error-slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.error-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .error-container {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .error-content {
    padding: 10px 12px;
  }
  
  .error-message {
    font-size: 0.9em;
  }
  
  .error-context {
    font-size: 0.8em;
  }
}
</style>
