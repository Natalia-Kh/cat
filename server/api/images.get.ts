export default defineEventHandler(async (event) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    setHeader(event, "Cache-Control", "public, max-age=300");

    const response = await fetch("https://cataas.com/cat", {
      signal: controller.signal,
      headers: {
        "User-Agent": "CatGame/1.0",
        Accept: "image/*",
      },
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Failed to fetch image: ${response.statusText}`,
      });
    }

    // Проверяем тип контента
    const contentType = response.headers.get("content-type");
    if (!contentType?.startsWith("image/")) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid image content type",
      });
    }

    // Устанавливаем правильный Content-Type
    setHeader(event, "Content-Type", contentType);

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    // Логируем ошибку
    console.error("Image API error:", error);

    // Возвращаем ошибку клиенту
    if (error instanceof Error && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error while fetching image",
    });
  }
});
