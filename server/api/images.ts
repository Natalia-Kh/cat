export default defineEventHandler(async (event) => {
  const response = await fetch("https://cataas.com/cat");
  return response;
});
