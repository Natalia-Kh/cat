import { defineStore } from "pinia";
import type { ComponentName } from "@/types/index";
export interface ModalState {
  isModalVisible: boolean;
  title: string;
  text?: string;
  showModalButtons: boolean;
  componentName?: ComponentName;
  componentFn?: (s: string) => void;
}

export const useModalStore = defineStore("modal", {
  state: (): ModalState => ({
    isModalVisible: false,
    title: "",
    text: undefined,
    componentName: undefined,
    showModalButtons: true,
    componentFn: undefined,
  }),

  getters: {},

  actions: {
    showModal(
      text?: string,
      title: string = "Уведомление",
      buttons: boolean = false,
      component?: ComponentName,
      componentFn?: (s: string) => void
    ) {
      this.text = text;
      this.title = title;
      this.showModalButtons = buttons;
      this.isModalVisible = true;
      this.componentName = component;
      this.componentFn = componentFn;
    },

    hideModal() {
      this.isModalVisible = false;
      setTimeout(() => {
        this.$reset();
      }, 300);
    },
  },
});
