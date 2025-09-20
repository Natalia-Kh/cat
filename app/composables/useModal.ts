export const useModal = () => {
  const isModalVisible = ref(false);
  const modalText = ref("");
  const modalTitle = ref("");
  const showModalButtons = ref(false);

  const showModal = (
    text: string,
    title: string = "Уведомление",
    buttons: boolean = false
  ) => {
    modalText.value = text;
    modalTitle.value = title;
    showModalButtons.value = buttons;
    isModalVisible.value = true;
  };

  const hideModal = () => {
    isModalVisible.value = false;
  };

  return {
    isModalVisible,
    modalText,
    modalTitle,
    showModalButtons,
    showModal,
    hideModal,
  };
};
