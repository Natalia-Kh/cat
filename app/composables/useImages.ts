interface ImageResult {
  url: string;
  index: number;
  status: StatusType.SUCCESS;
}

interface ImageError {
  url: null;
  index: number;
  error: string;
  status: StatusType.ERROR;
}

enum StatusType {
  ERROR = "error",
  SUCCESS = "success",
}

type ImageResponse = ImageResult | ImageError;

interface UseImagesOptions {
  immediate?: boolean;
  retryCount?: number;
}

interface UseImagesReturn {
  images: Ref<string[]>;
  loading: Ref<boolean>;
  fetchRandomImages: (count?: number) => Promise<void>;
}

export const useImages = (
  initialCount: number = 3,
  options?: UseImagesOptions
): UseImagesReturn => {
  const images = ref<string[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadSingleImage = async (
    index: number,
    retry = 0
  ): Promise<ImageResponse> => {
    try {
      const response = await $fetch("/api/images", {
        responseType: "blob",
        timeout: 10000,
      });

      let imageUrl: string;

      if (response instanceof Blob) {
        imageUrl = URL.createObjectURL(response);
      } else {
        throw new Error(`Unsupported response type: ${response.type}`);
      }

      return { url: imageUrl, index, status: StatusType.SUCCESS };
    } catch (err) {
      if (retry < (options?.retryCount || 0)) {
        return loadSingleImage(index, retry + 1);
      }

      return {
        url: null,
        index,
        error: err instanceof Error ? err.message : "Unknown error",
        status: StatusType.ERROR,
      };
    }
  };

  const fetchRandomImages = async (
    count: number = initialCount
  ): Promise<void> => {
    loading.value = true;
    error.value = null;
    images.value = [];

    try {
      const imagePromises = Array.from({ length: count }, (_, index) =>
        loadSingleImage(index)
      );

      const results = await Promise.all(imagePromises);
      const successful = results.filter(
        (result): result is ImageResult => result.status === StatusType.SUCCESS
      );

      images.value = successful.map((img) => img.url);

      const errors = results.filter(
        (result): result is ImageError => result.status === StatusType.ERROR
      );

      if (errors.length > 0) {
        console.warn(`Failed to load ${errors.length} images:`, errors);
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.error("Error fetching images:", err);
    } finally {
      loading.value = false;
    }
  };

  if (options?.immediate !== false) {
    onMounted(async () => {
      await fetchRandomImages(initialCount);
    });
  }

  return {
    images: images,
    loading: readonly(loading),
    fetchRandomImages,
  };
};
