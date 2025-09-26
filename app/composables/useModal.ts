export const useModal = () => {
  const isModalVisible = ref<boolean>(false);
  const modalText = ref<string>("");
  const modalTitle = ref<string>("");
  const showModalButtons = ref<boolean>(false);

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
