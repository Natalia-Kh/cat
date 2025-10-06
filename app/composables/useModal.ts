import { useModalStore } from "@/stores/modal";
import { storeToRefs } from "pinia";
import { useScroll } from "@/composables/useScroll";
const { lock, unlock } = useScroll();
export function useModal() {
  const modalStore = useModalStore();

  const {
    isModalVisible,
    text,
    title,
    showModalButtons,
    componentName,
    componentFn,
  } = storeToRefs(modalStore);

  const hideModal = () => modalStore.hideModal();
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && isModalVisible) {
      hideModal();
    }
  };
  watch(
    () => isModalVisible.value,
    (val) => {
      if (!import.meta.client) return;
      if (val) {
        lock();
      } else {
        unlock();
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

  return {
    isModalVisible,
    text,
    title,
    showModalButtons,
    componentName,
    componentFn,
    hideModal,
  };
}
