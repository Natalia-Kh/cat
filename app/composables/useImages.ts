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

export const useImages = () => {
  const fetchRandomImages = (
    count: number = 3,
    options?: {
      immediate?: boolean;
      retryCount?: number;
    }
  ) => {
    const key = `random-images-${count}-${Date.now()}`;

    return useAsyncData(
      key,
      async (): Promise<{
        images: string[];
      }> => {
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

            if (typeof response === "string") {
              imageUrl = response;
            } else if (response instanceof Blob) {
              imageUrl = URL.createObjectURL(response);
            } else {
              throw new Error("Unsupported response type");
            }

            return { url: imageUrl, index, status: StatusType.SUCCESS };
          } catch (error) {
            if (retry < (options?.retryCount || 0)) {
              return loadSingleImage(index, retry + 1);
            }

            return {
              url: null,
              index,
              error: error instanceof Error ? error.message : "Unknown error",
              status: StatusType.ERROR,
            };
          }
        };

        const imagePromises = Array.from({ length: count }, (_, index) =>
          loadSingleImage(index)
        );

        const results = await Promise.all(imagePromises);

        const successful = results.filter(
          (result): result is ImageResult =>
            result.status === StatusType.SUCCESS
        );

        return {
          images: successful.map((img) => img.url),
        };
      },
      {
        server: false,
        immediate: options?.immediate ?? true,
        default: () => ({
          images: [],
          errors: [],
        }),
      }
    );
  };

  return {
    fetchRandomImages,
  };
};
