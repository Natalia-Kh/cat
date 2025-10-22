export interface ErrorInfo {
  message: string;
  code?: string;
  context?: string;
  timestamp: number;
}

export const useErrorHandler = () => {
  const errors = ref<ErrorInfo[]>([]);
  const isErrorVisible = ref(false);
  const config = useRuntimeConfig();
  const addError = (error: unknown, context?: string) => {
    const errorInfo: ErrorInfo = {
      message: error instanceof Error ? error.message : String(error),
      context,
      timestamp: Date.now(),
    };

    errors.value.push(errorInfo);
    isErrorVisible.value = true;

    // Автоматически скрыть ошибку через 5 секунд
    setTimeout(() => {
      isErrorVisible.value = false;
    }, 5000);

    // Логирование в консоль для разработки
    if (config.public.dev) {
      console.error("Error:", errorInfo);
    }
  };

  const clearErrors = () => {
    errors.value = [];
    isErrorVisible.value = false;
  };

  const removeError = (timestamp: number) => {
    const index = errors.value.findIndex((e) => e.timestamp === timestamp);
    if (index > -1) {
      errors.value.splice(index, 1);
    }
  };

  return {
    errors: readonly(errors),
    isErrorVisible: readonly(isErrorVisible),
    addError,
    clearErrors,
    removeError,
  };
};

export const useImageErrorHandler = () => {
  const { addError } = useErrorHandler();
  const fallbackImages = ref<string[]>([]);

  const handleImageError = (error: unknown, imageUrl?: string) => {
    addError(error, `Image loading failed: ${imageUrl}`);

    // Добавить fallback изображение
    if (imageUrl && !fallbackImages.value.includes(imageUrl)) {
      fallbackImages.value.push(imageUrl);
    }
  };

  return {
    handleImageError,
    fallbackImages: readonly(fallbackImages),
  };
};
