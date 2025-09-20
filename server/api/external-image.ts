// server/api/external-image.ts
export default defineEventHandler(async (event) => {
  const url = "https://cataas.com/cat";

  try {
    const response = await $fetch(url, {
      responseType: "arrayBuffer",
    });

    // Устанавливаем заголовки
    setResponseHeaders(event, {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    });

    return response;
  } catch (error) {
    console.error("Proxy error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch image",
    });
  }
});
