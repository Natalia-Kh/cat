import { shallowRef, ref } from "vue";
import type { Component } from "vue";
import { type ComponentName, COMPONENT_NAMES } from "@/types/index";

export function useLazyComponent() {
  const resolvedComponent = shallowRef<Component | null>(null);
  const isLoading = ref(false);

  const lazyComponents: Record<ComponentName, () => Promise<any>> = {
    [COMPONENT_NAMES.MODAL_AUTH]: () => import("~/components/modal/Auth.vue"),
  };

  const loadComponent = async (name: ComponentName) => {
    isLoading.value = true;

    try {
      if (lazyComponents[name as keyof typeof lazyComponents]) {
        const componentModule = await lazyComponents[
          name as keyof typeof lazyComponents
        ]();
        resolvedComponent.value = componentModule.default;
      } else {
        console.warn(`Компонент "${name}" не зарегистрирован в lazyComponents`);
        resolvedComponent.value = null;
      }
    } catch (error) {
      console.error(`Ошибка загрузки компонента "${name}":`, error);
      resolvedComponent.value = null;
    } finally {
      isLoading.value = false;
    }
  };
  const resetComponent = () => {
    resolvedComponent.value = null;
  };
  return {
    resolvedComponent,
    isLoading,
    loadComponent,
    resetComponent,
  };
}
