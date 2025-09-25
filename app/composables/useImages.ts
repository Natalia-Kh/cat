export const useImages = () => {
  const images = ref<string[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchRandomImages = async (count: number = 3) => {
    loading.value = true;
    error.value = null;
    images.value = [];

    try {
      const imagePromises = Array.from({ length: count }, async () => {
        const response = await fetch("/api/images");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const blob = await response.blob();
        return URL.createObjectURL(blob);
      });
      const results = await Promise.allSettled(imagePromises);
      results.forEach((val) => {
        if (val.status === "fulfilled") {
          images.value.push(val.value);
        }
      });
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : "There was an error loading images";
      console.error("Error fetching images:", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    images,
    loading,
    error,
    fetchRandomImages,
  };
};
