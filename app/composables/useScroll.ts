export function useScroll() {
  const locked = ref(false);
  const initialBodyPadding = ref("");

  const lock = () => {
    if (locked.value) return;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    initialBodyPadding.value = document.body.style.paddingRight;

    const bodyPadding =
      parseInt(window.getComputedStyle(document.body).paddingRight) || 0;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${bodyPadding + scrollbarWidth}px`;

    locked.value = true;
  };

  const unlock = () => {
    if (!locked.value) return;

    document.body.style.overflow = "";
    document.body.style.paddingRight = initialBodyPadding.value;

    locked.value = false;
  };
  return { lock, unlock };
}
