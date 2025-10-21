export default defineEventHandler(async (event) => {
  try {
    // Добавляем заголовки для кэширования
    setHeader(event, 'Cache-Control', 'public, max-age=300'); // 5 минут кэш
    
    const response = await fetch("https://cataas.com/cat", {
      timeout: 5000,
      headers: {
        'User-Agent': 'CatGame/1.0',
        'Accept': 'image/*',
      }
    });
    
    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Failed to fetch image: ${response.statusText}`
      });
    }
    
    // Проверяем тип контента
    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid image content type'
      });
    }
    
    // Устанавливаем правильный Content-Type
    setHeader(event, 'Content-Type', contentType);
    
    return response;
  } catch (error) {
    // Логируем ошибку
    console.error('Image API error:', error);
    
    // Возвращаем ошибку клиенту
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while fetching image'
    });
  }
});
